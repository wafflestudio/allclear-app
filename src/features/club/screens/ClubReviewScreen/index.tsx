import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { CategoryMap } from '@/entities/category'
import { Club } from '@/entities/club'
import { ReviewKeyword } from '@/entities/review'
import { SCREEN_TYPE, StackParamList } from '@/entities/screen'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import useClickEventLog from '@/shared/hooks/useClickEventLog'
import React, { useContext, useEffect } from 'react'
import {
	ActivityIndicator,
	Dimensions,
	Image,
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

dayjs.locale('ko')

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.CLUB_REVIEW>
type DetailsScreenNavigationProp = NativeStackNavigationProp<
	StackParamList,
	SCREEN_TYPE.CLUB_DETAIL
>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const ClubReviewScreen = ({ route }: Props) => {
	const { uuid, category } = route.params as DetailsScreenRouteProp['params']
	const [selectedKeywordIds, setSelectedKeywordIds] = React.useState<ReviewKeyword['id'][]>([])
	// const [reviewContent, setReviewContent] = React.useState('')

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
					<ScrollView style={{ paddingHorizontal: 16 }}>
						<View style={{ marginLeft: 12 }}>
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
													<Text
														style={{
															fontSize: 13,
															marginRight: 4,
														}}>
														{keyword.iconUri?.trim()}
													</Text>
													<Text
														style={[
															styles.keywordTitle,
															selectedKeywordIds.includes(keyword.id)
																? {
																		color: Colors.TEXT_BUTTON_SELECTED,
																		fontWeight: 'bold',
																	}
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
							{/* <View style={styles.categoryContainer}>
								<Text style={styles.categoryTitle}>{'상세 활동 후기'}</Text>
								<View>
									<KeyboardAvoidingView
										keyboardVerticalOffset={50}
										behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
										style={{ flex: 1 }}>
										<TextInput
											style={{
												height: 100,
												paddingHorizontal: 12,
												paddingVertical: 8,
												fontSize: 13,
												marginBottom: 12,
												borderWidth: 1,
												borderRadius: 4,
												borderColor: '#E6E0DF', // #deprecated color
											}}
											multiline
											placeholder={'동아리 활동 후기를 자유롭게 작성해주세요'}
											value={reviewContent}
											onChangeText={setReviewContent}
										/>
									</KeyboardAvoidingView>

									<Text
										style={{
											position: 'absolute',
											fontSize: 13,
											color: '#C5BBB8', // #deprecated color
											bottom: 24,
											right: 12,
										}}>
										{reviewContent.length}자 / 200자
									</Text>
								</View>
								<Text
									style={{
										fontSize: 10,
										color: '#C5BBB8', // #deprecated color
									}}>
									{'※ 욕설이나 비방이 포함된 경우 임의로 삭제될 수 있습니다'}
								</Text>
							</View> */}
						</View>

						<TouchableOpacity
							disabled={isSubmitting || selectedKeywordIds.length === 0}
							style={[
								styles.submitCta,
								{ backgroundColor: categoryDetail.themeColor },
								isSubmitting || selectedKeywordIds.length === 0 ? { opacity: 0.4 } : null,
							]}
							onPress={handleSaveReview}>
							<Text
								style={{
									color: Colors.TEXT_BUTTON_SELECTED,
									fontSize: 16,
									fontWeight: 'bold',
									textAlign: 'center',
								}}>
								{'저장하기'}
							</Text>
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
	container: {},
	title: {
		color: '#FFFFFF', // #deprecated color
		fontWeight: 'bold',
		letterSpacing: -1,
		fontSize: 20,
		marginVertical: 20,
	},
	clubName: {
		fontWeight: 'bold',
		fontSize: 20,
		color: '#494141',
		marginBottom: 20,
		letterSpacing: -1,
	},
	categoryContainer: {
		backgroundColor: Colors.TEXT_BUTTON_SELECTED,
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
	},
	categoryTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#494141',
		marginBottom: 12,
	},
	keywordContainer: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		marginTop: 8,
	},
	keyword: {
		display: 'flex',
		width: 'auto',
		flexDirection: 'row',
		alignItems: 'center',
		alignSelf: 'flex-start',
		padding: 8,
		paddingHorizontal: 12,
		borderRadius: 32,
		borderWidth: 1,
		borderColor: '#f1d9d9',
	},
	keywordTitle: {},
	submitCta: {
		padding: 16,
		borderRadius: 12,
		marginVertical: 16,
	},
})
