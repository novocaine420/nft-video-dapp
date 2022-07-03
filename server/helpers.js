const getFileName = (str) => {
	const arr = str.split('.');
	const name = arr.slice(0, arr.length - 1).join('');
	const ext = arr[arr.length - 1];
	return `${name}-${Date.now()}.${ext}`;
};

const getJsonFullName = (str) => {
	const arr = str.split('-');
	const name = arr[arr.length - 1];
	const fileName = name.split('.')[0];
	return `${fileName}.json`;
};

module.exports = { getFileName, getJsonFullName };
