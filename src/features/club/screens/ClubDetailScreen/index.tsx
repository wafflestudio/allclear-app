import AutoScroll from '@homielab/react-native-auto-scroll'
import { BlurView } from '@react-native-community/blur'
import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { useLoginBottomSheet } from '@/shared/contexts/loginBottomSheetContext'
import { useProfile } from '@/shared/contexts/profileContext'
import { serviceContext } from '@/shared/contexts/serviceContext'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { CategoryMap } from '@/shared/constants/category'
import { Club } from '@/entities/club'
import { ReviewKeyword, ReviewKeywordCategory } from '@/entities/review'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import useClickEventLog from '@/shared/hooks/useClickEventLog'
import React, { useContext } from 'react'
import {
	ActivityIndicator,
	Dimensions,
	Image,
	Linking,
	ScrollView,
	StyleSheet,
	Text,
	View,
	useWindowDimensions,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Octicons'
import HtmlView from '@/shared/components/HtmlView'
import Header from '@/features/club/screens/ClubDetailScreen/Header'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

dayjs.locale('ko')

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.CLUB_DETAIL>
type DetailsScreenNavigationProp = NativeStackNavigationProp<
	StackParamList,
	SCREEN_TYPE.CLUB_DETAIL
>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const deviceHeight = Dimensions.get('window').height

const ClubDetailScreen = ({ route, navigation }: Props) => {
	const { uuid, category: paramCategory, entry_point } = route.params as DetailsScreenRouteProp['params']

	const { logClickEvent } = useClickEventLog()
	const { openBottomSheet } = useLoginBottomSheet()
	const { user } = useProfile()
	const { data: reviewKeywords } = useReviewKeywords()
	const { data: club, isLoading } = useClub({ uuid })
	const { width } = useWindowDimensions()

	const handleBackButton = () => navigation.goBack()

	const handleOpenBottomSheet = () => {
		logClickEvent({
			screen_name: 'club_detail_screen',
			screen_component_name: 'login_required_button',
		})

		openBottomSheet()
	}

	const handlePressPrimaryCTA = (c: Club) => {
		if (!user) {
			openBottomSheet()
			return
		}

		logClickEvent({
			screen_name: 'club_detail_screen',
			screen_component_name: 'club_ranking_rolling_banner',
			club_name: c.name,
		})

		navigation.navigate(SCREEN_TYPE.CLUB_REVIEW, {
			uuid: c.uuid,
			category: c.category,
		})
	}

	const handlePressSecondaryCTA = (c: Club) => {
		if (!user) {
			openBottomSheet()
			return
		}

		logClickEvent({
			screen_name: 'club_detail_screen',
			screen_component_name: 'club_ranking_card',
			club_name: c.name,
		})

		navigation.navigate(SCREEN_TYPE.CLUB_REVIEW, {
			uuid: c.uuid,
			category: c.category,
		})
	}

	const currentCategory = club?.category || paramCategory

	if (!currentCategory || isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>	
				<ActivityIndicator size="large" color="#000" />
			</View>
		)
	}

	const categoryDetail = CategoryMap[currentCategory]

	return (
		<WithViewEventLog
			params={{
				screen_name: 'club_detail_screen',
				category: currentCategory,
				club_name: club?.name ?? '',
				entry_point: entry_point ?? '',
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
						<View style={styles.mainImageWrapper}>
							<Image
								style={styles.mainImage}
								source={{
									uri: club.imageUri,
								}}
							/>
						</View>

						<View style={styles.container}>
							<Text style={styles.clubName}>{club.name}</Text>
							<Text style={styles.clubDescription}>{club.description}</Text>
							{club.introduction && (
								<View style={styles.clubDescription}>
									<HtmlView
										html={club.introduction}
										contentWidth={width}
										baseStyle={{
											flexWrap: 'wrap',
											whiteSpace: 'pre',
											color: '#8F8686',
										}}
									/>
								</View>
							)}
							<View style={styles.tagWrapper}>
								{(club.tags && club.tags.length === 0 ? ['동아리'] : club.tags).map(tag => (
									<View key={tag} style={styles.tag}>
										<Text style={styles.tagText}>{`#${tag}`}</Text>
									</View>
								))}
							</View>
						</View>

						<View style={[styles.container, styles.informationWrapper]}>
							<View style={styles.iconWrapper}>
								<Image
									style={styles.icon}
									source={require('@/assets/images/detail/clubtype.png')}
								/>
								<Text style={styles.iconDescription}>{club.type}</Text>
							</View>
							<View style={styles.iconWrapper}>
								<Image
									style={styles.icon}
									source={require('@/assets/images/detail/collegetype.png')}
								/>
								<Text style={styles.iconDescription}>{club.college}</Text>
							</View>
							<View style={styles.iconWrapper}>
								<Image
									style={styles.icon}
									source={require('@/assets/images/detail/recruittype.png')}
								/>
								<Text style={styles.iconDescription}>{`${club.recruitType || '정기'} 모집`}</Text>
							</View>
						</View>

						<View style={styles.container}>
							<AutoScroll>
								<View style={styles.reviewScrollWrapper}>
									{reviewKeywords?.map((keyword: ReviewKeyword) => (
										<View style={styles.reviewScrollCard}>
											<Text style={styles.reviewScrollIcon}>{keyword.iconUri?.trim()}</Text>
											<Text style={styles.reviewScrollTitle}>{keyword.title}</Text>
										</View>
									))}
								</View>
							</AutoScroll>
							<View style={styles.reviewCtaWrapper}>
								<TouchableOpacity
									style={{
										...styles.reviewCta,
										borderColor: categoryDetail.themeColor,
									}}
									onPress={() => handlePressPrimaryCTA(club)}>
									<View style={styles.reviewCtaText}>
										<Icon
											name="pencil"
											size={ms(16)}
											color={categoryDetail.themeColor}
											style={styles.reviewCtaIcon}
										/>
										<Text style={[styles.reviewCtaLabel, { color: categoryDetail.themeColor }]}>
											내 활동 경험 공유하기
										</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>

						<View style={styles.container}>
							<View style={styles.detailTitleWrapper}>
								<Text style={styles.detailTitle}>모집공고</Text>
								<TouchableOpacity onPress={() => Linking.openURL('https://tally.so/r/EkQrQN')}>
									<Text style={styles.detailRequestText}>모집 공고 업데이트 요청하기</Text>
								</TouchableOpacity>
							</View>
							{club.articleUploadedAt && (
								<View style={styles.update}>
									<Text style={styles.detailMetaText}>
										{dayjs(club.articleUploadedAt).format(
											(dayjs(club.articleUploadedAt).year() === dayjs().year() ? '' : 'YY년 ') +
												'M월 D일 dddd A h시에 업데이트 되었어요',
										)}
									</Text>
								</View>
							)}
							{club.article ? (
								<View style={styles.htmlContainer}>
									{!user && (
										<>
											<BlurView
												style={styles.blur}
												blurType="light"
												overlayColor="transparent"
												blurAmount={8}
												reducedTransparencyFallbackColor="white"
											/>
											<View style={styles.loginWrapper}>
												<Text style={styles.loginText}>
													{`${club.name} 동아리의 상세정보를 보려면`}
												</Text>
												<Text style={styles.loginText}>{`로그인이 필요해요!`}</Text>
												<TouchableOpacity
													style={styles.loginButton}
													onPress={handleOpenBottomSheet}>
													<Text style={styles.loginButtonText}>로그인 하러 가기</Text>
												</TouchableOpacity>
											</View>
										</>
									)}
									<HtmlView
										html={club.article}
										contentWidth={width}
										baseStyle={{
											flexWrap: 'wrap',
											whiteSpace: 'pre',
											color: '#8F8686',
										}}
									/>
								</View>
							) : (
								<View style={styles.emptyArticleWrapper}>
									<Text style={styles.emptyText}>{`상세정보가 없어요.`}</Text>
									<Text style={styles.emptyText}>{`${club.name} 동아리원 여러분!`}</Text>
									<Text style={styles.emptyText}>{`상세 정보를 전달해주시면 추가해 놓을게요`}</Text>
								</View>
							)}
						</View>

						<View style={styles.container}>
							<View style={styles.detailTitleWrapper}>
								<Text style={styles.detailTitle}>이런 점이 좋았어요</Text>
							</View>
							{club.totalReviews > 0 && (
								<View style={styles.reviewCountWrapper}>
									<Text style={styles.reviewCount}>
										{`현재까지 ${club.totalReviews}명이 참여했어요`}
									</Text>
								</View>
							)}
							{club.reviewKeywords.length > 0 ? (
								<View style={styles.reviewResultContainer}>
									{club.reviewKeywords.map(keyword => (
										<View style={styles.relative}>
											<View style={styles.reviewResult}>
												<Text style={styles.reviewResultIcon}>{keyword.iconUri?.trim()}</Text>
												<Text style={styles.reviewResultTitle}>{`"${keyword.title}"`}</Text>
												<Text
													style={[styles.reviewResultCount, { color: categoryDetail.themeColor }]}>
													{keyword.totalUpvotes}
												</Text>
											</View>
											<View
												style={[
													styles.reviewPortion,
													{
														backgroundColor: getReviewBackgroundColor(
															keyword.totalUpvotes,
															club.totalReviews,
															categoryDetail.themeColor,
														),
														width: getReviewWidth(keyword.totalUpvotes, club.totalReviews),
													},
												]}
											/>
										</View>
									))}
								</View>
							) : (
								<View style={styles.emptyReviewWrapper}>
									<Text style={styles.emptyText}>{`혹시 ${club.name}에서 활동하셨나요?`}</Text>
									<Text style={styles.emptyReviewDescription}>
										{`다음에 들어올 부원들을 위해 여러분의 경험을 공유해주세요!`}
									</Text>
									<TouchableOpacity onPress={() => handlePressSecondaryCTA(club)}>
										<Text style={styles.emptyReviewLink}>내 활동 경험 공유하기</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>

						<View style={styles.scrollBottomSpacer} />
					</ScrollView>
				)}
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default ClubDetailScreen

type UseClubProps = {
	uuid: Club['uuid']
}

const useClub = ({ uuid }: UseClubProps) => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery(['clubs', uuid], () => clubService.getClub({ uuid }))

	return query
}

const useReviewKeywords = () => {
	const { reviewService } = useContext(serviceContext)

	return useQuery(['reviewKeywords'], () => reviewService.listReviewKeywords(), {
		select: data =>
			data.categories?.reduce(
				(acc: ReviewKeyword[], c: ReviewKeywordCategory) => [...acc, ...c.keywords],
				[],
			),
	})
}

function getReviewBackgroundColor(
	curReview: number,
	maxReview: number,
	themeColor: string,
): string {
	const ratio = (curReview / maxReview) * 100

	if (ratio > 80) return `${themeColor}26`
	if (ratio > 60) return `${themeColor}1a`
	if (ratio > 40) return `${themeColor}0d`
	if (ratio > 20) return `${themeColor}0b`
	return `${themeColor}08`
}

function getReviewWidth(curReview: number, maxReview: number): `${number}%` {
	return `${(curReview / maxReview) * 90}%`
}

const styles = StyleSheet.create({
	scrollView: {
		padding: ms(16),
	},
	relative: {
		position: 'relative',
	},
	blur: {
		borderRadius: ms(12),
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		zIndex: 1,
	},
	loginWrapper: {
		position: 'absolute',
		width: '100%',
		margin: ms(12),
		zIndex: 2,
		marginTop: vs(40),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
	loginText: {
		...typography.bodyMRegular,
		color: '#8F8686',
		textAlign: 'center',
		marginTop: vs(12),
	},
	loginButton: {
		padding: ms(4),
		marginTop: vs(12),
	},
	loginButtonText: {
		...typography.bodyMSemibold,
		textDecorationLine: 'underline',
	},
	container: {
		borderRadius: ms(12),
		marginTop: vs(12),
		padding: ms(16),
		backgroundColor: Colors.TEXT_BUTTON_SELECTED,
	},
	mainImageWrapper: {
		width: ms(100),
		height: ms(100),
		borderRadius: ms(12),
		backgroundColor: Colors.TEXT_BUTTON_SELECTED,
		justifyContent: 'center',
		alignItems: 'center',
		padding: ms(16),
	},
	mainImage: {
		width: '100%',
		height: '100%',
		resizeMode: 'contain',
	},
	clubName: {
		...typography.headerXL,
		color: '#494141',
		marginBottom: vs(8),
	},
	clubDescription: {
		...typography.bodyMRegular,
		color: '#8F8686',
		marginBottom: vs(16),
	},
	tagWrapper: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		gap: ms(8),
	},
	tag: {
		padding: ms(6),
		borderRadius: ms(4),
		backgroundColor: '#F9F8F6',
	},
	tagText: {
		...typography.bodySRegular,
		color: '#8F8686',
	},
	informationWrapper: {
		paddingHorizontal: s(16),
		display: 'flex',
		flexDirection: 'row',
		gap: s(32),
		justifyContent: 'center',
	},
	iconWrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: vs(8),
		gap: ms(4),
	},
	icon: {
		width: ms(64),
		height: ms(64),
	},
	iconDescription: {
		...typography.bodySRegular,
		marginTop: vs(4),
		color: '#8F8686',
	},
	reviewScrollWrapper: {
		display: 'flex',
		flexDirection: 'row',
	},
	reviewScrollCard: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: ms(8),
		paddingHorizontal: s(12),
		marginHorizontal: s(4),
		borderRadius: ms(32),
		borderWidth: 1,
		borderColor: '#f1d9d9',
	},
	reviewScrollIcon: {
		...typography.bodyMRegular,
		marginRight: s(4),
	},
	reviewScrollTitle: {
		...typography.bodySRegular,
		color: '#1e1e1e',
	},
	reviewCtaWrapper: {
		marginTop: vs(16),
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	reviewCta: {
		width: '100%',
		padding: ms(12),
		borderRadius: ms(32),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
	},
	reviewCtaText: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	reviewCtaIcon: {
		marginRight: s(8),
	},
	reviewCtaLabel: {
		...typography.bodySRegular,
	},
	detailTitleWrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		marginBottom: vs(6),
	},
	detailTitle: {
		...typography.headerL,
		color: '#494141',
	},
	detailRequestText: {
		...typography.bodySRegular,
		color: '#8F8686',
		textDecorationLine: 'underline',
	},
	reviewCountWrapper: {
		marginBottom: vs(16),
	},
	reviewCount: {
		...typography.bodySRegular,
		color: '#8F8686',
	},
	detailMetaText: {
		...typography.bodySRegular,
		color: '#8F8686',
	},
	update: {},
	htmlContainer: {
		position: 'relative',
		marginTop: vs(12),
		padding: ms(12),
		borderRadius: ms(2),
		borderWidth: 1,
		borderColor: '#e5e5e5',
	},
	reviewResultContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: ms(4),
	},
	reviewResult: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		padding: ms(12),
		paddingHorizontal: s(16),
		borderRadius: ms(8),
		backgroundColor: '#f5f5f5',
	},
	reviewResultIcon: {
		...typography.bodyMRegular,
		marginRight: s(4),
	},
	reviewResultTitle: {
		...typography.bodyMSemibold,
		color: '#1e1e1e',
	},
	reviewResultCount: {
		...typography.bodyMSemibold,
		marginLeft: 'auto',
	},
	reviewPortion: {
		position: 'absolute',
		top: 0,
		left: 0,
		borderRadius: ms(8),
		width: '100%',
		height: '100%',
	},
	emptyArticleWrapper: {
		height: vs(200),
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyReviewWrapper: {
		height: vs(150),
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyText: {
		...typography.bodySRegular,
		color: '#8F8686',
	},
	emptyReviewDescription: {
		...typography.bodySRegular,
		color: '#8F8686',
		marginTop: vs(4),
	},
	emptyReviewLink: {
		...typography.bodySRegular,
		color: '#8F8686',
		marginTop: vs(16),
		textDecorationLine: 'underline',
	},
	scrollBottomSpacer: {
		marginBottom: vs(32),
	},
})
