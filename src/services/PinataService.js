import axios from 'axios';

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
	return res.data;
};
