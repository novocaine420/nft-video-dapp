import React, { useState } from 'react';
import { ethers } from 'ethers';

function WalletBalance() {
	const [balance, setBalance] = useState();

	const getBalance = async () => {
		const [account] = await window.ethereum.request({
			method: 'eth_requestAccounts'
		});
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const balance = await provider.getBalance(account);
		setBalance(ethers.utils.formatEther(balance));
	};

	return (
		<div className="w-96 max-w-lg items-center justify-center overflow-hidden rounded-2xl bg-slate-200 shadow-xl">
			<div className="h-24 bg-white" />
			<div className="-mt-20 flex justify-center">
				<img
					className="h-32 rounded-full"
					src="https://media.istockphoto.com/vectors/male-profile-flat-blue-simple-icon-with-long-shadow-vector-id522855255?k=20&m=522855255&s=612x612&w=0&h=fLLvwEbgOmSzk1_jQ0MgDATEVcVOh_kqEe0rqi7aM5A="
					alt="user-logo"
				/>
			</div>
			<div className="mt-5 mb-1 px-3 text-center text-lg">Your Name</div>
			<div className="mb-5 px-3 text-center text-sky-500">Your Balance: {balance}</div>
			<button
				type="button"
				className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
				onClick={() => getBalance()}
			>
				Show My Balance
			</button>
		</div>
	);
}

export default WalletBalance;