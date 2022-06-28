require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const { uploadFileToS3, getS3ObjectStream } = require('./services/s3');
const { pinFileToIPFS, pinJsonToIPFS } = require('./services/pinata');

const app = express();

// // enable files upload
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: '/tmp/'
	})
);

// add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// start app
const port = process.env.PORT || 4200;

// Idiomatic expression in express to route and respond to a client request
app.get('/', (req, res) => {
	// get requests to the root ("/") will route here
	res.send('Hello World!'); // server responds by sending the index.html file to the client's browser
	// the .sendFile method needs the absolute path to the file, see: https:// expressjs.com/en/4x/api.html#res.sendFile
});

app.post('/upload-video', async (req, res) => {
	try {
		if (!req.files) {
			res.send({
				status: false,
				message: 'No file uploaded'
			});
		} else {
			// Use the name of the input field (i.e. "video") to retrieve the uploaded file
			const { video } = req.files;
			console.log('video', video);
			// Use the mv() method to place the file in upload directory (i.e. "uploads")
			console.log('uploadFileToS3');
			const data = await uploadFileToS3(video);
			console.log('uploaded', data.Location);
			const s3Stream = await getS3ObjectStream(data);
			console.log('pinFileToIPFS');
			const { fileIPFS } = await pinFileToIPFS(s3Stream, data.Key);
			console.log('pinned', fileIPFS);
			console.log('pinJsonToIPFS');
			const tokenURI = await pinJsonToIPFS(fileIPFS, data.Key, data.Location);
			console.log('pinned json', tokenURI);

			// send response
			res.send({
				status: true,
				message: 'File is uploaded',
				data: {
					name: video.name,
					mimetype: video.mimetype,
					size: video.size
				}
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.listen(port, () => {
	// server starts listening for any attempts from a client to connect at port: {port}
	console.log(`Now listening on port ${port}`);
});
