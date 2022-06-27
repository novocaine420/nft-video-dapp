import axios from 'axios';

export const pinFileToIPFS = async (file) => {
	if (file) {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const resFile = await axios({
				method: 'post',
				url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
				data: formData,
				headers: {
					pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
					pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`,
					'Content-Type': 'multipart/form-data'
				}
			});

			const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
			console.log(ImgHash);
			// Take a look at your Pinata Pinned section, you will see a new file added to you list.
		} catch (error) {
			console.log('Error sending File to IPFS: ');
			console.log(error);
		}
	}
};

export const getPinList = async () => {
	const config = {
		method: 'get',
		url: 'https://api.pinata.cloud/data/pinList?status=pinned&pinSizeMin=100',
		headers: {
			pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
			pinata_secret_api_key: `${process.env.REACT_APP_PINATA_API_SECRET}`
		}
	};

	const res = await axios(config);
	console.log(res.data);
	return res.data;
};
