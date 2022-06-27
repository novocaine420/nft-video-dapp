import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import Button from '../button/Button';
import UploadIcon from '../../icons/UploadIcon.svg';
import './DropModal.css';

const DropModal = ({ onUpload }) => {
	const [showDropModal, setShowDropModal] = useState(false);

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		maxFiles: 1
	});

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	const openModal = () => {
		setShowDropModal(true);
	};

	const closeModal = () => {
		setShowDropModal(false);
	};

	const uploadFiles = useCallback(() => {
		onUpload(acceptedFiles);
		closeModal();
	}, [onUpload, acceptedFiles]);

	return (
		<section className="container">
			<div className="container py-20">
				<Button title="Open Modal" onClick={openModal} type="primary" />
			</div>
			{showDropModal && (
				<div className="modal-wrapper">
					<div className="modal">
						<div className="flex flex-wrap -mx-3">
							<div {...getRootProps({ className: 'dropzone' })}>
								<main className="flex items-center justify-center bg-gray-100 font-sans">
									<label htmlFor="dropzone-file" className="dropzone-label">
										<img className="h-12" src={UploadIcon} alt="upload" />
										<h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">
											Payment File
										</h2>

										<p className="mt-2 text-gray-500 tracking-wide">
											Upload or drag & drop your file SVG, PNG, JPG or GIF.{' '}
										</p>

										<input id="dropzone-file" type="file" className="hidden" {...getInputProps()} />
									</label>
								</main>
							</div>
							<aside className="mt-5 mb-5">
								<h4>Files</h4>
								<ul>{files}</ul>
							</aside>
							<div className="w-full flex justify-between">
								<Button title="Cancel" onClick={closeModal} type="secondary" />
								<Button title="Upload" onClick={uploadFiles} type="primary" />
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	);
};

DropModal.propTypes = {
	onUpload: PropTypes.func
};

export default DropModal;
