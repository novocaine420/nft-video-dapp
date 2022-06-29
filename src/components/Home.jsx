import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { ethers } from 'ethers';
import WalletBalance from './WalletBalance';
import VideoNFT from '../artifacts/contracts/VideoNFT.sol/VideoNFT.json';
import DropModal from './drop-modal/DropModal';
import Button from './button/Button';
import { getPinList } from '../services/PinataService';
import VideoPlayer from './video-player/VideoPlayer';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, VideoNFT.abi, signer);

function Home() {
	const [totalMinted, setTotalMinted] = useState(0);
	const [files, setFiles] = useState([]);
	console.log(totalMinted, files);

	const getCount = useCallback(async () => {
		const count = await contract.count();
		setTotalMinted(parseInt(count));
	}, []);

	const getFiles = async () => {
		try {
			const { count, rows } = await getPinList();
			console.log(`${count} files in total`);
			setFiles(rows);
		} catch (error) {
			console.log('Error getting files from IPFS: ', error);
		}
	};

	useEffect(() => {
		getCount();
		getFiles();
	}, [getCount]);

	const onUpload = async (files) => {
		const formData = new FormData();
		formData.append('video', files[0]);

		const resFile = await axios({
			method: 'post',
			url: `${process.env.REACT_APP_API_URL}/upload-video`,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		console.log(resFile);
		await getFiles();
	};

	return (
		<div>
			<WalletBalance />
			<section className="pt-20 lg:pt-[120px] pb-10 lg:pb-20 bg-[#F3F4F6]">
				<div className="container">
					<div className="flex flex-wrap -mb-4">
						{files.slice(0, files.length - 1).map((file) => (
							// eslint-disable-next-line react/no-array-index-key
							<NFTVideo
								contentId={file.ipfs_pin_hash}
								key={file.id}
								tokenId={file.metadata.name}
								getCount={getCount}
								fileURL={file.metadata.keyvalues.fileURL}
							/>
						))}
						<div className="w-full md:w-1/2 xl:w-1/3 px-4">
							<div className="bg-white rounded-lg overflow-hidden mb-10">
								<div className="px-6 py-4">
									<DropModal onUpload={onUpload} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

function NFTVideo({ contentId, tokenId, getCount, fileURL }) {
	console.log(contentId, getCount, fileURL);
	// const metadataURI = `${contentId}/${tokenId}.json`;
	// // const videoURL = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}`;
	//
	// const [isMinted, setIsMinted] = useState(false);
	// const [tokenURI, setTokenURI] = useState(false);
	//
	// const getURI = useCallback(() => {
	// 	return contract.tokenURI(tokenId);
	// }, [tokenId]);
	//
	// const getMintedStatus = useCallback(async () => {
	// 	const result = await contract.isContentOwned(metadataURI);
	// 	setIsMinted(result);
	// 	if (result) {
	// 		const uri = await getURI();
	// 		setTokenURI(uri);
	// 	}
	// }, [metadataURI, getURI]);
	//
	// useEffect(() => {
	// 	getMintedStatus();
	// }, [getMintedStatus]);
	// const mintToken = async () => {
	// 	const connection = contract.connect(signer);
	// 	const addr = connection.address;
	//
	// 	const result = await contract.payToMint(addr, metadataURI, {
	// 		value: ethers.utils.parseEther('0.05')
	// 	});
	// 	await result.wait();
	// 	getMintedStatus();
	// 	getCount();
	// };

	return (
		<div className="w-full md:w-1/2 xl:w-1/3 px-4">
			<div className="bg-white rounded-lg overflow-hidden mb-10">
				<VideoPlayer fileURL={fileURL} />
				<div className="px-6 py-4">
					<h5 className="font-bold text-xl mb-2">ID #{tokenId}</h5>
					{/* {isMinted ? <h6>Token URI: {tokenURI}</h6> : null} */}
					{/* <div className="flex justify-between"> */}
					{/* 	<Button title="Mint" onClick={mintToken} type="primary" /> */}
					{/* 	<Button title="Transfer" onClick={mintToken} type="secondary" /> */}
					{/* </div> */}
				</div>
			</div>
		</div>
	);
}

function NFTImage({ tokenId, getCount }) {
	const contentId = 'QmPXCmjeM97GnczPXAAFQBEWissF4bZ6ciWJpvvjDYajQN';
	const metadataURI = `${contentId}/${tokenId}.json`;
	const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.svg`;

	const [isMinted, setIsMinted] = useState(false);
	const [tokenURI, setTokenURI] = useState(false);

	const getURI = useCallback(() => {
		return contract.tokenURI(tokenId);
	}, [tokenId]);

	const getMintedStatus = useCallback(async () => {
		const result = await contract.isContentOwned(metadataURI);
		setIsMinted(result);
		if (result) {
			const uri = await getURI();
			setTokenURI(uri);
		}
	}, [metadataURI, getURI]);

	useEffect(() => {
		getMintedStatus();
	}, [getMintedStatus]);
	const mintToken = async () => {
		const connection = contract.connect(signer);
		const addr = connection.address;

		const result = await contract.payToMint(addr, metadataURI, {
			value: ethers.utils.parseEther('0.05')
		});
		await result.wait();
		getMintedStatus();
		getCount();
	};

	return (
		<div className="w-full md:w-1/2 xl:w-1/3 px-4">
			<div className="bg-white rounded-lg overflow-hidden mb-10">
				<img className="w-full" src={imageURI} alt="nft" />
				<div className="px-6 py-4">
					<h5 className="font-bold text-xl mb-2">ID #{tokenId}</h5>
					{isMinted ? <h6>Token URI: {tokenURI}</h6> : null}
					<div className="flex justify-between">
						<Button title="Mint" onClick={mintToken} type="primary" />
						<Button title="Transfer" onClick={mintToken} type="secondary" />
					</div>
				</div>
			</div>
		</div>
	);
}

NFTImage.propTypes = {
	tokenId: PropTypes.number,
	getCount: PropTypes.func
};

NFTVideo.propTypes = {
	contentId: PropTypes.string,
	tokenId: PropTypes.string,
	getCount: PropTypes.func,
	fileURL: PropTypes.string
};

export default Home;
