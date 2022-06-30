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

const port = process.env.PORT || 4200;

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
			console.log('File received', video);
			// Use the mv() method to place the file in upload directory (i.e. "uploads")
			console.log('Upload to S3...');
			const data = await uploadFileToS3(video);
			console.log('File uploaded!', data.Location);
			const s3Stream = await getS3ObjectStream(data);
			const fileURL = `${process.env.IMAGE_KIT_URL}/${data.Key}`;
			console.log('Pin file to IPFS...');
			const { fileIPFS } = await pinFileToIPFS(s3Stream, data.Key, fileURL);
			console.log('File pinned!', fileIPFS);
			console.log('Pin JSON to IPFS...');
			const tokenURI = await pinJsonToIPFS(fileIPFS, data.Key, fileURL);
			console.log('JSON pinned!', tokenURI);

			// send response
			res.send({
				status: true,
				message: 'File successfully uploaded!',
				data: {
					ipfs: fileIPFS,
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
