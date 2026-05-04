import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

type Props = {
	title: string
	onBack: () => void
}

const Header = ({ title, onBack }: Props) => {
	return (
		<View style={styles.container}>
			<View style={styles.titleContainer}>
				<Text style={styles.title} numberOfLines={1}>
					{title}
				</Text>
			</View>

			<TouchableOpacity style={styles.backButton} onPress={onBack}>
				<Icon name="chevron-left" size={ms(28)} color={Colors.BODYTEXT_SUB} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: vs(56),
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: s(16),
		backgroundColor: Colors.WHITE,
	},
	titleContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: s(48),
	},
	title: {
		...typography.headerL,
		color: Colors.BODYTEXT_SUB,
	},
	backButton: {
		width: ms(32),
		height: ms(32),
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 10,
	},
})

export default Header
