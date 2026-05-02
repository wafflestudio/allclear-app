import { Image, StyleSheet, Text, View } from 'react-native'

import { Colors } from '@/shared/constants/colors'
import { Category, CategoryMap } from '@/entities/category'
import { Club } from '@/entities/club'

type Props = {
	club: Club
	category?: Category['name']
}

const ClubCard = ({ club, category }: Props) => {
	const categoryDetail = category ? CategoryMap[category] : undefined
	const borderColor = categoryDetail ? categoryDetail.themeColor : Colors.GRAY
	const backgroundColor = categoryDetail ? categoryDetail.backgroundColor : Colors.WHITE

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
							<Text style={styles.reviewKeywordTitle} numberOfLines={1}>
								{keyword.title}
							</Text>
						</View>
					))}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		height: 90,
	},
	imageWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.WHITE,
		width: 90,
		height: 90,
		marginRight: 16,
		borderWidth: 0.5,
		borderRadius: 8,
	},
	image: {
		width: 70,
		height: 70,
	},
	contentWrapper: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
		paddingTop: 1,
		paddingBottom: 3,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: 2,
	},
	description: {
		color: Colors.BODYTEXT_SUB,
		fontSize: 14,
	},
	reviewView: {
		flexDirection: 'row',
		marginTop: 'auto',
		gap: 4,
		paddingTop: 6,
	},
	reviewKeyword: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 8,
		borderRadius: 24,
		borderWidth: 0.5,
		flexShrink: 1,
	},
	reviewKeywordIcon: {
		fontSize: 9,
		marginRight: 4,
	},
	reviewKeywordTitle: {
		fontSize: 9,
		flexShrink: 1,
	},
})

export default ClubCard
