import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'

const SearchResultHeader = () => {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>어떤 동아리를 찾아볼까요?</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		height: vs(65),
		justifyContent: 'center',
		paddingHorizontal: s(20),
		backgroundColor: Colors.BACKGROUND_MAIN,
	},
	title: {
		...typography.headerXXLSemibold,
		color: Colors.BODYTEXT_MAIN,
	},
})

export default SearchResultHeader
