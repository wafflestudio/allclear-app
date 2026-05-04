import { Image, StyleSheet, Text, View } from 'react-native'

import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { Category, CategoryMap } from '@/entities/category'
import { Club } from '@/entities/club'
import { ms, s, vs } from '@/shared/utils/scale'

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
		height: ms(90),
	},
	imageWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.WHITE,
		width: ms(90),
		height: ms(90),
		marginRight: s(16),
		borderWidth: 0.5,
		borderRadius: ms(8),
	},
	image: {
		width: ms(70),
		height: ms(70),
	},
	contentWrapper: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '100%',
		paddingTop: vs(1),
		paddingBottom: vs(3),
	},
	title: {
		...typography.headerL,
		marginBottom: vs(2),
	},
	description: {
		...typography.bodyMRegular,
		color: Colors.BODYTEXT_SUB,
	},
	reviewView: {
		flexDirection: 'row',
		marginTop: 'auto',
		gap: ms(4),
		paddingTop: vs(6),
	},
	reviewKeyword: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: vs(4),
		paddingHorizontal: s(8),
		borderRadius: ms(24),
		borderWidth: 0.5,
		flexShrink: 1,
	},
	reviewKeywordIcon: {
		...typography.bodyXSSemibold,
		marginRight: s(4),
	},
	reviewKeywordTitle: {
		...typography.bodyXSSemibold,
		flexShrink: 1,
	},
})

export default ClubCard
