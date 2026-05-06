import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { CategoryMap } from '@/shared/constants/category'
import { Club } from '@/entities/club'
import { ReviewKeyword } from '@/entities/review'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import useClickEventLog from '@/shared/hooks/useClickEventLog'
import React, { useContext, useEffect } from 'react'
import {
	ActivityIndicator,
	Dimensions,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { navigation } from '@/shared/utils/navigation'
import Header from '@/features/club/screens/ClubReviewScreen/Header'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

dayjs.locale('ko')

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.CLUB_REVIEW>
type DetailsScreenNavigationProp = NativeStackNavigationProp<
	StackParamList,
	SCREEN_TYPE.CLUB_REVIEW
>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const deviceHeight = Dimensions.get('window').height

const ClubReviewScreen = ({ route }: Props) => {
	const { uuid, category } = route.params
	const [selectedKeywordIds, setSelectedKeywordIds] = React.useState<ReviewKeyword['id'][]>([])

	const { data: reviewKeywordCategories } = useReviewKeywordCategories()
	const { data: club, isLoading } = useClub({ uuid })
	const { data: myClubReviewIds } = useMyClubReview({ uuid })
	const { mutate, isLoading: isSubmitting } = useCreateClubReview({
		uuid,
		reviewKeywordIds: selectedKeywordIds,
	})
	const { logClickEvent } = useClickEventLog()

	useEffect(() => {
		if (!myClubReviewIds) return

		setSelectedKeywordIds(myClubReviewIds)
	}, [myClubReviewIds])

	const handleBackButton = () => navigation.goBack()

	const handleSaveReview = async () => {
		logClickEvent({
			screen_name: 'club_review_screen',
			screen_component_name: 'save_review_button',
		})

		mutate()
	}

	if (!category || !club) return null

	const categoryDetail = CategoryMap[category]

	return (
		<WithViewEventLog
			params={{
				screen_name: 'club_review_screen',
				category,
				club_name: club?.name ?? '',
				entry_point: 'club_detail',
			}}>
			<SafeAreaView
				edges={['top']}
				style={{ flex: 0, backgroundColor: categoryDetail.themeColor }}
			/>
			<SafeAreaView edges={['left', 'right']} style={{ flex: 1, padding: 0, overflow: 'scroll' }}>
				<Header club={club} onBack={handleBackButton} />
				{isLoading && (
					<View style={{ height: deviceHeight }}>
						<ActivityIndicator
							size="large"
							color={categoryDetail.themeColor}
							style={{ marginTop: deviceHeight * 0.3 }}
						/>
					</View>
				)}
				{club && (
					<ScrollView style={styles.scrollView}>
						<View style={styles.titleWrapper}>
							<Text style={styles.title}>{`${club.name} 에서의 경험을 공유해주세요 😀`}</Text>
						</View>
						<View style={styles.container}>
							{reviewKeywordCategories?.map(kc => (
								<View key={kc.id} style={styles.categoryContainer}>
									<Text style={styles.categoryTitle}>{kc.title}</Text>
									<View style={styles.keywordContainer}>
										{kc.keywords.map(keyword => (
											<TouchableOpacity
												key={keyword.id}
												onPress={() => {
													setSelectedKeywordIds(
														selectedKeywordIds.includes(keyword.id)
															? selectedKeywordIds.filter(id => id !== keyword.id)
															: [...selectedKeywordIds, keyword.id],
													)
												}}>
												<View
													style={[
														styles.keyword,
														selectedKeywordIds.includes(keyword.id)
															? {
																	backgroundColor: `${categoryDetail.themeColor}`,
																	borderColor: `${categoryDetail.themeColor}`,
																}
															: null,
													]}>
													<Text style={styles.keywordIcon}>{keyword.iconUri?.trim()}</Text>
													<Text
														style={[
															styles.keywordTitle,
															selectedKeywordIds.includes(keyword.id)
																? styles.selectedKeywordTitle
																: null,
														]}>
														{keyword.title}
													</Text>
												</View>
											</TouchableOpacity>
										))}
									</View>
								</View>
							))}
						</View>

						<TouchableOpacity
							disabled={isSubmitting || selectedKeywordIds.length === 0}
							style={[
								styles.submitCta,
								{ backgroundColor: categoryDetail.themeColor },
								isSubmitting || selectedKeywordIds.length === 0 ? { opacity: 0.4 } : null,
							]}
							onPress={handleSaveReview}>
							<Text style={styles.submitCtaText}>{'저장하기'}</Text>
						</TouchableOpacity>
					</ScrollView>
				)}
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default ClubReviewScreen

type UseClubProps = {
	uuid: Club['uuid']
}

const useClub = ({ uuid }: UseClubProps) => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery(['clubs', uuid], () => clubService.getClub({ uuid }))

	return query
}

const useReviewKeywordCategories = () => {
	const { reviewService } = useContext(serviceContext)

	return useQuery(['reviewKeywords'], () => reviewService.listReviewKeywords(), {
		select: data => data.categories,
	})
}

const useMyClubReview = ({ uuid }: { uuid: Club['uuid'] }) => {
	const { reviewService } = useContext(serviceContext)

	return useQuery(['myClubReview', uuid], () => reviewService.getMyClubReview({ uuid }), {
		select: data => data?.reviewKeywordIds,
	})
}

const useCreateClubReview = ({
	uuid,
	reviewKeywordIds,
}: {
	uuid: Club['uuid']
	reviewKeywordIds: ReviewKeyword['id'][]
}) => {
	const queryClient = useQueryClient()
	const { reviewService } = useContext(serviceContext)

	return useMutation(() => reviewService.createClubReviews({ uuid, reviewKeywordIds }), {
		onSuccess: () => {
			Toast.show({
				type: 'info',
				position: 'bottom',
				text1: '🎉  리뷰가 저장되었어요',
			})
			queryClient.invalidateQueries()
			navigation.goBack()
		},
	})
}

const styles = StyleSheet.create({
	scrollView: {
		paddingHorizontal: s(16),
	},
	titleWrapper: {
		marginLeft: s(12),
	},
	container: {},
	title: {
		color: '#FFFFFF', // #deprecated color
		...typography.headerXL,
		marginVertical: vs(20),
	},
	categoryContainer: {
		backgroundColor: Colors.TEXT_BUTTON_SELECTED,
		borderRadius: ms(12),
		padding: ms(16),
		marginBottom: vs(16),
	},
	categoryTitle: {
		...typography.headerL,
		color: '#494141',
		marginBottom: vs(12),
	},
	keywordContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: ms(12),
		marginTop: vs(8),
	},
	keyword: {
		display: 'flex',
		width: 'auto',
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		padding: ms(8),
		paddingHorizontal: s(12),
		borderRadius: ms(32),
		borderWidth: 1,
		borderColor: '#f1d9d9',
	},
	keywordIcon: {
		...typography.bodyMRegular,
		marginRight: s(4),
	},
	keywordTitle: {
		...typography.bodyMRegular,
	},
	selectedKeywordTitle: {
		...typography.bodyMSemibold,
		color: Colors.TEXT_BUTTON_SELECTED,
	},
	submitCta: {
		padding: ms(16),
		borderRadius: ms(12),
		marginVertical: vs(16),
	},
	submitCtaText: {
		...typography.headerL,
		color: Colors.TEXT_BUTTON_SELECTED,
		textAlign: 'center',
	},
})
