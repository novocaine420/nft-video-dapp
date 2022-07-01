import React from 'react';
import PropTypes from 'prop-types';

const VideoPlayer = ({ fileURL, disabled }) => {
	return (
		<div className="w-full">
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<video className="h-80" width="100%" src={fileURL} controls={!disabled} />
		</div>
	);
};

VideoPlayer.propTypes = {
	fileURL: PropTypes.string,
	disabled: PropTypes.bool
};

export default VideoPlayer;
