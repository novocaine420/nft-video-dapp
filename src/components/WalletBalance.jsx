import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ethers } from 'ethers';
import DropModal from './drop-modal/DropModal';

function WalletBalance({ onUpload }) {
	const [accountId, setAccountId] = useState();
	const [balance, setBalance] = useState();

	const getBalance = async () => {
		try {
			const [account] = await window.ethereum.request({
				method: 'eth_requestAccounts'
			});
			setAccountId(account);
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const balance = await provider.getBalance(account);
			setBalance(ethers.utils.formatEther(balance));
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		getBalance();
	}, []);

	return (
		<div className="items-center justify-center overflow-hidden rounded-2xl bg-slate-200 shadow-xl relative">
			<div className="h-24 bg-white" />
			<div className="-mt-20 flex justify-center">
				<img
					className="h-32 rounded-full"
					src="https://media.istockphoto.com/vectors/male-profile-flat-blue-simple-icon-with-long-shadow-vector-id522855255?k=20&m=522855255&s=612x612&w=0&h=fLLvwEbgOmSzk1_jQ0MgDATEVcVOh_kqEe0rqi7aM5A="
					alt="user-logo"
				/>
			</div>
			<div className="mt-5 mb-1 px-3 text-center text-lg">Account ID: {accountId}</div>
			<div className="mb-5 px-3 text-center text-sky-500">Your Balance: {balance}</div>
			<DropModal onUpload={onUpload} />
		</div>
	);
}

WalletBalance.propTypes = {
	onUpload: PropTypes.func
};

export default WalletBalance;
