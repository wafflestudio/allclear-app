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
		<View style={{ padding: 24 }}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingHorizontal: 12,
				}}>
				<View style={{ marginBottom: 12 }}>
					<Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.GRAY_50 }}>
						활동 후기가 많은 동아리
					</Text>
				</View>
			</View>

			{isLoading && (
				<TouchableOpacity>
					<View
						style={{
							padding: 36,
							height: 240,
							backgroundColor: 'white',
							borderRadius: 8,
							borderWidth: 1,
							borderColor: '#E6E0DF',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<SkeletonPlaceholder borderRadius={4}>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item>
									<SkeletonPlaceholder.Item width={300} height={20} />
									<SkeletonPlaceholder.Item marginTop={6} width={180} height={20} />
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
					<View
						style={{
							padding: 36,
							backgroundColor: 'white',
							borderRadius: 8,
							borderWidth: 1,
							borderColor: '#E6E0DF',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<View>
							<Image
								style={{ width: 60, height: 60 }}
								source={require('@/assets/icons/trophy.png')}
							/>
						</View>

						<View
							style={{
								marginTop: 12,
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}>
							<View
								style={{
									width: 40,
									paddingHorizontal: 8,
									paddingVertical: 4,
									borderRadius: 40,
									backgroundColor: Colors.GRAY_50,
									marginBottom: 12,
								}}>
								<Text style={{ color: Colors.WHITE, fontWeight: 'bold', textAlign: 'center' }}>
									1위
								</Text>
							</View>
							<View
								style={{
									marginBottom: 12,
								}}>
								<Text
									style={{
										fontSize: 20,
										fontWeight: 'bold',
										color: Colors.GRAY_50,
									}}>
									{clubRankings?.[0].clubName}
								</Text>
							</View>
							<View>
								<Text
									style={{
										fontSize: 12,
										color: Colors.GRAY_50,
										opacity: 0.6,
									}}>
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
								<View style={{ position: 'relative' }}>
									<View style={styles.rankingResult}>
										<Image
											source={getRankingIconSource(index)}
											style={{
												width: 24,
												height: 24,
											}}
										/>
										<Text
											style={{
												color: Colors.WHITE,
												fontSize: 14,
												fontWeight: 'bold',
												marginLeft: 8,
											}}>
											{`---`}
										</Text>
									</View>
									<View
										style={[
											styles.rankingPortion,
											{
												backgroundColor: Colors.GRAY_50,
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
							<View style={{ position: 'relative' }}>
								<View style={styles.rankingResult}>
									{index < 3 && (
										<Image
											source={getRankingIconSource(index)}
											style={{
												width: 24,
												height: 24,
											}}
										/>
									)}
									<Text
										style={{
											color: Colors.WHITE,
											fontSize: 14,
											fontWeight: 'bold',
											marginLeft: 8,
										}}>
										{`${ranking.clubName}`}
									</Text>
									<Text style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
										{ranking.totalReviews}
									</Text>
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
	rankingContainer: {
		marginTop: 8,
		gap: 8,
	},
	rankingResult: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderRadius: 6,
	},
	rankingPortion: {
		position: 'absolute',
		backgroundColor: Colors.GRAY_50,
		zIndex: -1,
		top: 0,
		left: 0,
		borderRadius: 8,
		height: '100%',
	},
})
