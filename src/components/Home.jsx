import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';

import WalletBalance from './WalletBalance';
import VideoNFT from '../artifacts/contracts/VideoNFT.sol/VideoNFT.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, VideoNFT.abi, signer);

function Home() {
	const [totalMinted, setTotalMinted] = useState(0);
	console.log(totalMinted);

	const getCount = useCallback(async () => {
		console.log(contract);
		const count = await contract.count();
		console.log(parseInt(count));
		setTotalMinted(parseInt(count));
	}, []);

	useEffect(() => {
		getCount();
	}, [getCount]);

	return (
		<div>
			<WalletBalance />
			<div className="flex flex-wrap -mb-4">
				{Array(4)
					.fill(0)
					.map((_, i) => (
						// eslint-disable-next-line react/no-array-index-key
						<div key={i} className="w-1/3 max-w-sm rounded shadow-lg">
							<NFTImage tokenId={i} getCount={getCount} />
						</div>
					))}
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
		console.log(result);
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
		<div className="container max-w-full">
			<img className="w-full" src={imageURI} alt="nft" />
			<div className="px-6 py-4">
				<h5 className="font-bold text-xl mb-2">ID #{tokenId}</h5>
				{isMinted ? <h6>Token URI: {tokenURI}</h6> : null}
				<button
					type="button"
					className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
					onClick={mintToken}
				>
					Mint
				</button>
			</div>
		</div>
	);
}

NFTImage.propTypes = {
	tokenId: PropTypes.number,
	getCount: PropTypes.func
};

export default Home;
