const hre = require('hardhat');

const main = async () => {
	const VideoNFT = await hre.ethers.getContractFactory('VideoNFT');
	const videoNFT = await VideoNFT.deploy();
	await videoNFT.deployed();
	console.log('VideoNFT deployed to:', videoNFT.address);
};
const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};
runMain();
