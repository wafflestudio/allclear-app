import { Colors } from '@/shared/constants/colors'
import { Club } from '@/entities/club'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

type Props = {
	club: Club
	onBack: () => void
}

const Header = ({ club, onBack }: Props) => {
	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<TouchableOpacity style={styles.backButton} onPress={onBack}>
					<Icon color={'#FFFFFF' /* #deprecated color */} name="chevron-left" size={ms(24)} />
				</TouchableOpacity>
				<View style={styles.titleWrapper}>
					<Text style={styles.title}>{club.name}</Text>
				</View>
				{/* For Margin */}
				<View style={styles.rightSpacer} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: ms(20),
		paddingBottom: vs(8),
		display: 'flex',
		flexDirection: 'column',
		zIndex: 3,
	},
	headerRow: {
		position: 'relative',
		flex: 1,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		zIndex: 3,
	},
	backButton: {
		marginBottom: vs(12),
	},
	titleWrapper: {
		marginLeft: s(12),
	},
	title: {
		...typography.headerXXL,
		color: Colors.WHITE,
	},
	rightSpacer: {
		width: ms(24),
	},
})

export default Header
