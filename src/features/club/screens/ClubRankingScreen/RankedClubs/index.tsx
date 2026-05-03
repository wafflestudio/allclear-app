import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { Club } from '@/entities/club'
import { SCREEN_TYPE } from '@/entities/screen'
import useClickEventLog from '@/shared/hooks/useClickEventLog'
import React, { useContext } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { navigation } from '@/shared/utils/navigation'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

const RankedClubs = () => {
	const { clubService } = useContext(serviceContext)
	const { data: clubRankings, isLoading } = useClubRankings()

	const { logClickEvent } = useClickEventLog()

	const maxReviewCntByClub =
		clubRankings?.reduce((acc, ranking) => Math.max(acc, Number(ranking.totalReviews)), 0) ?? 1

	const handlePress = async (
		uuid: Club['uuid'],
		ranking: number,
		screenComponentName: 'rankingBar' | 'rankingCard',
	) => {
		const club = await clubService.getClub({ uuid })

		logClickEvent({
			screen_name: 'club_review_screen',
			screen_component_name: screenComponentName,
			club_name: club.name,
			ranking: `${ranking}`,
		})

		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, { uuid: club.uuid, category: club.category })
	}

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<View style={styles.titleWrapper}>
					<Text style={styles.sectionTitle}>활동 후기가 많은 동아리</Text>
				</View>
			</View>

			{isLoading && (
				<TouchableOpacity>
					<View style={styles.featuredSkeletonCard}>
						<SkeletonPlaceholder borderRadius={ms(4)}>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item>
									<SkeletonPlaceholder.Item width={s(300)} height={vs(20)} />
									<SkeletonPlaceholder.Item marginTop={vs(6)} width={s(180)} height={vs(20)} />
								</SkeletonPlaceholder.Item>
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder>
					</View>
				</TouchableOpacity>
			)}

			{!isLoading && clubRankings?.[0] && (
				<TouchableOpacity
					onPress={() =>
						handlePress(clubRankings[0].clubId, clubRankings[0].ranking, 'rankingCard')
					}>
					<View style={styles.featuredCard}>
						<View>
							<Image
								style={styles.trophyIcon}
								source={require('@/assets/icons/trophy.png')}
							/>
						</View>

						<View style={styles.featuredContent}>
							<View style={styles.rankBadge}>
								<Text style={styles.rankBadgeText}>1위</Text>
							</View>
							<View style={styles.featuredClubNameWrapper}>
								<Text style={styles.featuredClubName}>{clubRankings?.[0].clubName}</Text>
							</View>
							<View>
								<Text style={styles.featuredReviewCount}>
									{clubRankings?.[0].totalReviews}건
								</Text>
							</View>
						</View>
					</View>
				</TouchableOpacity>
			)}

			{isLoading && (
				<View style={styles.rankingContainer}>
					{Array.from({ length: 7 })
						.fill(0)
						.map((_, index) => ({
							clubId: index,
							totalReviews: 5,
						}))
						.map((ranking, index) => (
							<TouchableOpacity key={ranking.clubId}>
								<View style={styles.relative}>
									<View style={styles.rankingResult}>
										<Image
											source={getRankingIconSource(index)}
											style={styles.rankingIcon}
										/>
										<Text style={styles.rankingName}>
											{`---`}
										</Text>
									</View>
									<View
										style={[
											styles.rankingPortion,
											{
												backgroundColor: '#3A3434', // #deprecated color,
												width: `${(7 - index) * 3 + 60}%`,
											},
										]}
									/>
								</View>
							</TouchableOpacity>
						))}
				</View>
			)}

			{!isLoading && (
				<View style={styles.rankingContainer}>
					{clubRankings?.map((ranking, index) => (
						<TouchableOpacity
							key={ranking.clubId}
							onPress={() => handlePress(ranking.clubId, ranking.ranking, 'rankingBar')}>
							<View style={styles.relative}>
								<View style={styles.rankingResult}>
									{index < 3 && (
										<Image
											source={getRankingIconSource(index)}
											style={styles.rankingIcon}
										/>
									)}
									<Text style={styles.rankingName}>
										{`${ranking.clubName}`}
									</Text>
									<Text style={styles.rankingCount}>{ranking.totalReviews}</Text>
								</View>
								<View
									style={[
										styles.rankingPortion,
										{
											width: getRankingWidth(ranking.totalReviews, maxReviewCntByClub, index + 1),
										},
									]}
								/>
							</View>
						</TouchableOpacity>
					))}
				</View>
			)}
		</View>
	)
}

export default RankedClubs

const useClubRankings = () => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery(['clubs', 'ranked'], () => clubService.listClubRankings({ topK: 7 }), {
		keepPreviousData: true,
		select: data => data.rankings,
	})

	return query
}

function getRankingWidth(curReview: number, maxReview: number, ranking: number): `${number}%` {
	return `${Math.max((curReview / maxReview) * 90 - ranking - Math.random() * 2, 55)}%`
}

function getRankingIconSource(index: number) {
	if (index % 3 === 0) return require('@/assets/icons/first-place.png')
	if (index % 3 === 1) return require('@/assets/icons/second-place.png')
	return require('@/assets/icons/third-place.png')
}

const styles = StyleSheet.create({
	container: {
		padding: ms(24),
	},
	headerRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: s(12),
	},
	titleWrapper: {
		marginBottom: vs(12),
	},
	sectionTitle: {
		...typography.headerL,
		color: '#3A3434' /* #deprecated color */,
	},
	featuredSkeletonCard: {
		padding: ms(36),
		height: vs(240),
		backgroundColor: Colors.WHITE,
		borderRadius: ms(8),
		borderWidth: 1,
		borderColor: '#E6E0DF',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	featuredCard: {
		padding: ms(36),
		backgroundColor: Colors.WHITE,
		borderRadius: ms(8),
		borderWidth: 1,
		borderColor: '#E6E0DF',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	trophyIcon: {
		width: ms(60),
		height: ms(60),
	},
	featuredContent: {
		marginTop: vs(12),
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	rankBadge: {
		width: s(40),
		paddingHorizontal: s(8),
		paddingVertical: vs(4),
		borderRadius: ms(40),
		backgroundColor: '#3A3434', // #deprecated color,
		marginBottom: vs(12),
	},
	rankBadgeText: {
		...typography.bodyMSemibold,
		color: Colors.WHITE,
		textAlign: 'center',
	},
	featuredClubNameWrapper: {
		marginBottom: vs(12),
	},
	featuredClubName: {
		...typography.headerXL,
		color: '#3A3434', // #deprecated color,
	},
	featuredReviewCount: {
		...typography.bodySRegular,
		color: '#3A3434', // #deprecated color,
		opacity: 0.6,
	},
	relative: {
		position: 'relative',
	},
	rankingContainer: {
		marginTop: vs(8),
		gap: vs(8),
	},
	rankingResult: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: vs(12),
		paddingHorizontal: s(10),
		borderRadius: ms(6),
	},
	rankingIcon: {
		width: ms(24),
		height: ms(24),
	},
	rankingName: {
		...typography.bodyMSemibold,
		color: Colors.WHITE,
		marginLeft: s(8),
	},
	rankingCount: {
		...typography.bodyMSemibold,
		marginLeft: 'auto',
	},
	rankingPortion: {
		position: 'absolute',
		backgroundColor: '#3A3434', // #deprecated color,
		zIndex: -1,
		top: 0,
		left: 0,
		borderRadius: ms(8),
		height: '100%',
	},
})
