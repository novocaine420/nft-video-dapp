module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es6: true,
		node: true,
		jest: true
	},
	extends: ['airbnb', 'plugin:react-hooks/recommended', 'plugin:prettier/recommended'],
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2020,
		sourceType: 'module',
		allowImportExportEverywhere: true
	},
	globals: {
		chrome: true,
		env: true
	},
	rules: {
		indent: 'off',
		quotes: ['error', 'single', { avoidEscape: true }],
		semi: ['error', 'always'],
		radix: 'off',
		'prefer-destructuring': ['error', { object: true, array: false }],
		'function-paren-newline': 'off',
		'object-curly-newline': 'off',
		'no-prototype-builtins': 'off',
		'arrow-body-style': 'off',
		'no-continue': 'off',
		'no-plusplus': 'off',
		'no-shadow': 'off',
		'no-console': 'off',
		'no-tabs': 'off',
		'comma-dangle': 'off',
		'class-methods-use-this': 'off',
		'arrow-parens': 'off',
		'operator-linebreak': 'off',
		'no-param-reassign': 'off',
		'no-use-before-define': 'off',
		'implicit-arrow-linebreak': 'off',
		'no-underscore-dangle': 'off',
		'jsx-quotes': 'error',
		'react/destructuring-assignment': 'off',
		'react/jsx-indent': 'off',
		'react/jsx-indent-props': 'off',
		'react/forbid-prop-types': 1,
		'react/jsx-one-expression-per-line': 'off',
		'react/jsx-closing-bracket-location': 'off',
		'react/require-default-props': 'off',
		'react/jsx-boolean-value': 'off',
		'react/jsx-filename-extension': 'warn',

		// By Airbnb default, it also has 'ForOfStatement', we dont want that
		'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

		curly: ['error', 'all'],

		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: ['**/test/**'],
				optionalDependencies: false,
				peerDependencies: false
			}
		]
	},
	settings: {
		react: {
			version: 'detect'
		}
	}
};
