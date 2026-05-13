import React from 'react'
import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Club } from '@/entities/club'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

type Props = {
	club: Club
	isSaved: boolean
	onToggleSaved: () => void
}

const ClubListItem = ({ club, isSaved, onToggleSaved }: Props) => {
	const reviewKeywords = club.reviewKeywords?.slice(0, 2) ?? []

	return (
		<View style={styles.container}>
			<View style={styles.imageWrapper}>
				<Image style={styles.image} resizeMode="contain" source={{ uri: club.imageUri }} />
			</View>

			<View style={styles.contentWrapper}>
				<View style={styles.textGroup}>
					<View style={styles.titleRow}>
						<Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
							{club.name}
						</Text>
						<Pressable
							onPress={event => {
								event.stopPropagation()
								onToggleSaved()
							}}
							hitSlop={10}
							style={styles.heartButton}>
							<Icon
								name={isSaved ? 'heart' : 'heart-outline'}
								size={ms(20)}
								color={isSaved ? Colors.POINTCOLOR : Colors.BODYTEXT_DISABLED}
							/>
						</Pressable>
					</View>
					<Text numberOfLines={2} ellipsizeMode="tail" style={styles.description}>
						{club.description}
					</Text>
				</View>

				<View style={styles.reviewView}>
					{reviewKeywords.length > 0 ? (
						reviewKeywords.map((keyword, index) => (
							<View key={`${club.uuid}-${keyword.id}-${index}`} style={styles.reviewKeyword}>
								<Text style={styles.reviewKeywordIcon}>{keyword.iconUri?.trim()}</Text>
								<Text style={styles.reviewKeywordTitle} numberOfLines={1}>
									{keyword.title}
								</Text>
							</View>
						))
					) : (
						<View style={styles.noReviewBadge}>
							<Text style={styles.noReviewText}>아직 리뷰가 없어요</Text>
						</View>
					)}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		minHeight: s(90),
	},
	imageWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.WHITE,
		width: s(90),
		height: s(90),
		marginRight: s(15),
		borderWidth: 0.5,
		borderColor: '#CBCBCB',
		borderRadius: ms(8),
		overflow: 'hidden',
	},
	image: {
		width: s(70),
		height: s(70),
		borderRadius: ms(8),
	},
	contentWrapper: {
		flex: 1,
		minWidth: 0,
		gap: vs(3),
	},
	textGroup: {
		gap: vs(4),
	},
	titleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(10),
	},
	title: {
		...typography.headerL,
		fontFamily: 'Pretendard-SemiBold',
		color: Colors.BODYTEXT_MAIN,
		flex: 1,
	},
	heartButton: {
		width: ms(24),
		height: ms(24),
		alignItems: 'center',
		justifyContent: 'center',
	},
	description: {
		...typography.bodyMRegular,
		lineHeight: vs(21),
		color: Colors.BODYTEXT_SUB,
	},
	reviewView: {
		flexDirection: 'row',
		alignItems: 'center',
		height: vs(24),
		gap: ms(4),
	},
	reviewKeyword: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: s(6),
		paddingTop: vs(5),
		paddingBottom: vs(6),
		borderRadius: ms(15),
		borderWidth: 0.3,
		borderColor: Colors.POINTCOLOR,
		backgroundColor: 'rgba(135, 79, 255, 0.1)',
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
	noReviewBadge: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: s(6),
		paddingTop: vs(5),
		paddingBottom: vs(6),
		borderRadius: ms(20),
		borderWidth: 0.3,
		borderColor: '#CBCBCB',
		backgroundColor: 'rgba(193, 193, 193, 0.1)',
	},
	noReviewText: {
		...typography.bodyXSRegular,
		color: Colors.BODYTEXT_SUB,
	},
})

export default ClubListItem
