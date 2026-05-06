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
				<View style={styles.textGroup}>
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
		height: s(90),
	},
	imageWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.WHITE,
		width: s(90),
		height: s(90),
		marginRight: s(15),
		borderWidth: 0.5,
		borderRadius: ms(8),
	},
	image: {
		width: s(70),
		height: s(70),
	},
	contentWrapper: {
		flex: 1,
		flexDirection: 'column',
	},
	textGroup: {
		flex: 1,
	},
	title: {
		...typography.headerL,
		color: Colors.BODYTEXT_MAIN,
		marginBottom: vs(4),
	},
	description: {
		...typography.bodyMRegular,
		color: Colors.BODYTEXT_SUB,
	},
	reviewView: {
		flexDirection: 'row',
		height: vs(20),
		gap: ms(4),
	},
	reviewKeyword: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: s(6),
		borderRadius: ms(24),
		borderWidth: 0.5,
		flexShrink: 1,
	},
	reviewKeywordIcon: {
		...typography.bodyXSSemibold,
		marginRight: s(4),
	},
	reviewKeywordTitle: {
		...typography.bodyXSRegular,
		color: Colors.BODYTEXT_SUB,
		flexShrink: 1,
	},
})

export default ClubCard
