import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactNativePlugin from 'eslint-plugin-react-native';
import prettierConfig from 'eslint-config-prettier';

export default [
	{
		ignores: ['node_modules/**', 'android/**', 'ios/**', 'vendor/**', '.history/**', 'babel.config.js'],
	},
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
				__DEV__: 'readonly',
			},
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			'@typescript-eslint': tsPlugin,
			react: reactPlugin,
			'react-hooks': reactHooksPlugin,
			'react-native': reactNativePlugin,
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			...reactPlugin.configs.recommended.rules,
			...reactHooksPlugin.configs.recommended.rules,
			'react-native/no-unused-styles': 'warn',
			'react-native/split-platform-components': 'warn',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'react/jsx-key': 'off',
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'react-native/no-inline-styles': 'off',
			'react-hooks/refs': 'off',
			'react-hooks/set-state-in-effect': 'off',
		},
	},
	prettierConfig,
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@typescript-eslint/no-shadow': 'error',
			'no-shadow': 'off',
			'no-undef': 'off',
		},
	},
];
