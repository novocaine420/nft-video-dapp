import React from 'react';

const Spinner = () => {
	return (
		<div className="flex justify-center items-center space-x-2 h-full">
			{Array(7)
				.fill(0)
				.map((_, i) => (
					<div
						// eslint-disable-next-line react/no-array-index-key
						key={i}
						className="animate-pulse inline-block w-8 h-8 bg-blue-600 rounded-full opacity-0"
						role="status"
					/>
				))}
		</div>
	);
};

export default Spinner;
