import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'

import { Colors } from '@/shared/constants/colors'
import { Category, CategoryMap } from '@/entities/category'
import { Club } from '@/entities/club'

type Props = {
	club: Club
	category?: Category['name']
}

const addAlpha = (hex: string, opacity: number) => {
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)
	return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

const ClubListItem = ({ club, category }: Props) => {
	const categoryDetail = category ? CategoryMap[category] : undefined
	const borderColor = categoryDetail ? categoryDetail.themeColor : Colors.FYI_GRAY_300
	const backgroundColor = categoryDetail ? addAlpha(borderColor, 0.1) : Colors.WHITE

	return (
		<View style={styles.container}>
			<View style={[styles.imageWrapper, { borderColor: borderColor }]}>
				<Image style={styles.image} resizeMode="contain" source={{ uri: club.imageUri }} />
			</View>

			<View style={styles.contentWrapper}>
				<View>
					<Text style={styles.title}>{club.name}</Text>
					<Text numberOfLines={2} style={styles.description}>
						{club.description}
					</Text>
				</View>
				<View style={styles.reviewView}>
					{club.reviewKeywords?.slice(0, 2).map((keyword, index) => (
						<View
							key={`${club.name}-${index}`}
							style={[
								styles.reviewKeyword,
								{ borderColor: borderColor, backgroundColor: backgroundColor },
							]}>
							<Text style={styles.reviewKeywordIcon}>{keyword.iconUri?.trim()}</Text>
							<Text style={styles.reviewKeywordTitle}>{keyword.title}</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 0,
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: Dimensions.get('window').width - 50,
		height: 100,
	},
	imageWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.WHITE,
		width: 100,
		height: 100,
		marginRight: 16,
		borderWidth: 0.5,
		borderRadius: 8,
	},
	image: {
		width: 80,
		height: 80,
	},
	contentWrapper: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
		paddingVertical: 3,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: 2,
	},
	description: {
		color: '#757474',
		fontSize: 14,
	},
	reviewView: {
		flexDirection: 'row',
		marginTop: 'auto',
		gap: 8,
	},
	reviewKeyword: {
		width: 'auto',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 24,
		borderWidth: 0.5,
	},
	reviewKeywordIcon: {
		fontSize: 11,
		marginRight: 4,
	},
	reviewKeywordTitle: {
		fontSize: 11,
	},
})

export default ClubListItem
