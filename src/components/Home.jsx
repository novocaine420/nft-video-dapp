import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import { ethers } from 'ethers';
import WalletBalance from './WalletBalance';
import VideoNFT from '../artifacts/contracts/VideoNFT.sol/VideoNFT.json';
import Button from './button/Button';
import { getPinList } from '../services/PinataService';
import VideoPlayer from './video-player/VideoPlayer';
import { getJsonName } from '../helpers';
import Spinner from './spinner/Spinner';

const contractAddress = '0xF6c909c37A43Ac48ab6Ca9E5DBF92c61364DED76';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, VideoNFT.abi, signer);

function Home() {
	const [isLoading, setIsLoading] = useState(false);
	const [files, setFiles] = useState([]);

	const groupNFTs = (list) => {
		const res = [];
		list.forEach((item) => {
			const fileName = item.metadata.name;
			if (fileName.includes('.json')) {
				const jsonName = fileName.split('.')[0];
				const file = list.find((item2) => {
					const itemName = item2.metadata.name;
					return itemName.includes(jsonName) && !itemName.includes('.json');
				});
				res.push([file, item]);
			}
		});
		return res.reverse();
	};

	const getFiles = async () => {
		try {
			setIsLoading(true);
			const { rows } = await getPinList();
			const videos = rows.slice(0, files.length - 1);
			setFiles(groupNFTs(videos));
		} catch (error) {
			console.error('Error getting files from IPFS: ', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getFiles();
	}, []);

	const onUpload = async (files) => {
		try {
			const formData = new FormData();
			formData.append('video', files[0]);

			await axios({
				method: 'post',
				url: `${process.env.REACT_APP_API_URL}/upload-video`,
				data: formData,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});
			await getFiles();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col h-screen">
			<WalletBalance onUpload={onUpload} />
			<section className="pt-20 lg:pt-[32px] pb-10 lg:pb-20 bg-[#F3F4F6] flex flex-grow">
				<div className="container mx-auto">
					{isLoading ? (
						<Spinner />
					) : (
						<div className="flex flex-wrap -mb-4">
							{files.map(([file, json], i) => (
								<NFTVideo
									key={file.id}
									contentId={json?.ipfs_pin_hash}
									tokenId={i}
									fileName={file?.metadata.name}
									jsonName={getJsonName(json?.metadata.name)}
									fileURL={file.metadata.keyvalues.fileURL}
								/>
							))}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}

function NFTVideo({ contentId, tokenId, fileURL, jsonName, fileName }) {
	const metadataURI = `${contentId}/${jsonName}.json`;

	const [isMinted, setIsMinted] = useState(false);

	const getURI = useCallback(async () => {
		const uri = await contract.tokenURI(tokenId);
		alert(uri);
	}, [tokenId]);

	const getMintedStatus = useCallback(async () => {
		try {
			const result = await contract.isContentOwned(metadataURI);
			setIsMinted(result);
		} catch (err) {
			console.error(err);
		}
	}, [metadataURI]);

	useEffect(() => {
		getMintedStatus();
	}, [getMintedStatus]);

	const mintToken = async () => {
		try {
			const connection = contract.connect(signer);
			const { address } = connection;
			const result = await contract.payToMint(address, metadataURI, {
				value: ethers.utils.parseEther('0.05')
			});
			await result.wait();
			getMintedStatus();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="w-full md:w-1/2 xl:w-1/3 px-4">
			<div className="bg-white rounded-lg overflow-hidden mb-10">
				<VideoPlayer fileURL={fileURL} disabled={!isMinted} />
				<div className="px-6 py-4">
					<h5 className="font-bold text-xl mb-2">Token ID: #{tokenId}</h5>
					<h5 className="font-medium leading-tight text-xl mt-0 mb-2 text-slate-400">{fileName}</h5>
					<div className="flex justify-between mt-5 mb-5">
						{!isMinted ? (
							<Button title="Mint" onClick={mintToken} type="primary" />
						) : (
							<Button title="Taken! Show URI" onClick={getURI} type="secondary" />
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

NFTVideo.propTypes = {
	contentId: PropTypes.string,
	tokenId: PropTypes.number,
	fileURL: PropTypes.string,
	jsonName: PropTypes.string,
	fileName: PropTypes.string
};

export default Home;
