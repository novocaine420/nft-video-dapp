const axios = require('axios');
const FormData = require('form-data');

const form = new FormData();

const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const apiKey = `${process.env.REACT_APP_PINATA_API_KEY}`;
const apiSecret = `${process.env.REACT_APP_PINATA_API_SECRET}`;

const pinFileToIPFS = async (stream, fileName) => {
	form.append('file', stream, {
		filename: fileName // required or it fails
	});

	const config = {
		method: 'post',
		url,
		maxBodyLength: Infinity,
		headers: {
			pinata_api_key: apiKey,
			pinata_secret_api_key: apiSecret,
			...form.getHeaders()
		},
		data: form
	};

	return axios(config)
		.then((response) => {
			return {
				success: true,
				fileIPFS: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
			};
		})
		.catch((error) => {
			console.log(error);
		});
};

const pinJsonToIPFS = async (fileIPFS, fileName, fileURL) => {
	const metadata = {
		fileURL: fileIPFS,
		name: `${fileName}.json`,
		description: 'Video Description',
		attributes: [{ fileURL }]
	};

	const pinataJSONBody = JSON.stringify({
		pinataMetadata: {
			name: `${fileName}.json`,
			keyvalues: {
				fileURL: fileIPFS
			}
		},
		pinataContent: metadata
	});

	const jsonResponse = await axios.post(
		'https://api.pinata.cloud/pinning/pinJSONToIPFS',
		pinataJSONBody,
		{
			headers: {
				'Content-Type': 'application/json',
				pinata_api_key: apiKey,
				pinata_secret_api_key: apiSecret
			}
		}
	);
	const { data: jsonData = {} } = jsonResponse;
	const { IpfsHash } = jsonData;
	const tokenURI = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`;
	return tokenURI;
};

module.exports = { pinFileToIPFS, pinJsonToIPFS };
