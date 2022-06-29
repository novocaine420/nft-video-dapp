import React from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ fileURL }) => {
	return (
		<div className="w-full">
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<video className="h-80" width="100%" src={fileURL} controls />
		</div>
	);
};

VideoPlayer.propTypes = {
	fileURL: PropTypes.string
};

export default VideoPlayer;
