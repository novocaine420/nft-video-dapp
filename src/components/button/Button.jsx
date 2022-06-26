import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const classes = {
	primary: 'primary-button',
	secondary: 'secondary-button'
};

const Button = ({ title, onClick, type }) => {
	return (
		<button type="button" className={classes[type]} onClick={onClick}>
			{title}
		</button>
	);
};

Button.propTypes = {
	title: PropTypes.string,
	onClick: PropTypes.func,
	type: PropTypes.string
};

export default Button;
