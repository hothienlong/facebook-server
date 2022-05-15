module.exports = {
	env: {
		es2021: true,
		node: true,
		jest: true,
	},
	extends: ["eslint:recommended"],
	parser: "babel-eslint",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["prettier"],
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "unix"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		"prettier/prettier": [
			1,
			{
				trailingComma: "es5",
				singleQuote: true,
				semi: true,
				useTabs: true,
			},
		],
		...require('eslint-config-prettier').rules,
	},
};
