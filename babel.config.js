module.exports = {
	presets: ['module:@react-native/babel-preset'],
	plugins: [
		['@babel/plugin-proposal-decorators', { legacy: true }],
		[
			'module-resolver',
			{
				root: ['./src'],
				extensions: ['.js', 'jsx', '.ts', '.tsx', '.json'],
			},
		],
		'react-native-reanimated/plugin',
	],
}
