import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { Colors } from '@/shared/constants/colors'
import { Category } from '@/entities/category'

type Props = {
	category?: Category['name']
	onBack: () => void
}

const Header = ({ category, onBack }: Props) => {
	if (!category) return null

	return (
		<View style={styles.container}>
			<View style={styles.titleContainer}>
				<Text style={styles.title} numberOfLines={1}>
					{category} 동아리
				</Text>
			</View>

			<TouchableOpacity style={styles.backButton} onPress={onBack}>
				<Icon name="chevron-left" size={28} color="#757474" />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 56,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		backgroundColor: Colors.WHITE,
	},
	titleContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 48,
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#757474',
	},
	backButton: {
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: 10,
	},
})

export default Header
