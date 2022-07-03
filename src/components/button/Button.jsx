import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const classes = {
	primary: 'primary-button',
	secondary: 'secondary-button',
	disabled: 'disabled'
};

const Button = ({ title, onClick, type = 'primary', classNames = '', disabled }) => {
	return (
		<button
			type="button"
			className={`${classes[disabled ? 'disabled' : type]} ${classNames}`}
			onClick={onClick}
			disabled={disabled}
		>
			{title}
		</button>
	);
};

Button.propTypes = {
	title: PropTypes.string,
	onClick: PropTypes.func,
	type: PropTypes.string,
	classNames: PropTypes.string,
	disabled: PropTypes.bool
};

export default Button;
