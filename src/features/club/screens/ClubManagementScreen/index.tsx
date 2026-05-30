import React, { useContext, useState } from 'react'
import {
	ActivityIndicator,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { RouteProp, useRoute } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { Colors } from '@/shared/constants/colors'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { ms, s, vs } from '@/shared/utils/scale'
import { navigation } from '@/shared/utils/navigation'

type RouteProps = RouteProp<StackParamList, typeof SCREEN_TYPE.CLUB_MANAGEMENT>

// 최근 공고 표시 개수 (더보기 전)
const VISIBLE_COUNT = 3

const ClubManagementScreen = () => {
	const route = useRoute<RouteProps>()
	const { clubId } = route.params

	const { clubService, recruitmentService } = useContext(serviceContext)

	const [showMore, setShowMore] = useState(false)

	const { data: club } = useQuery({
		queryKey: ['club', clubId],
		queryFn: () => clubService.getClub({ uuid: clubId }),
	})

	const { data: recruitmentsData, isLoading } = useQuery({
		queryKey: ['clubRecruitments', clubId],
		queryFn: () => recruitmentService.listClubRecruitments({ clubId }),
	})

	const recruitments = recruitmentsData?.recruitments ?? []
	const visibleRecruitments = showMore ? recruitments : recruitments.slice(0, VISIBLE_COUNT)
	const hasMore = recruitments.length > VISIBLE_COUNT

	return (
		<SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
			{/* 헤더 */}
			<View style={styles.header}>
				<Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
					<Icon name="chevron-left" size={ms(24)} color="#757474" />
				</Pressable>
				<Text style={styles.headerTitle}>동아리 관리</Text>
			</View>

			<ScrollView
				style={styles.scroll}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}>
				{/* 동아리 카드 */}
				<View style={styles.clubCard}>
					{club?.imageUri ? (
						<Image source={{ uri: club.imageUri }} style={styles.clubCardBg} />
					) : (
						<View style={[styles.clubCardBg, { backgroundColor: '#E8E4F0' }]} />
					)}
					<View style={styles.clubCardOverlay} />
					<View style={styles.clubCardContent}>
						<View style={styles.clubCardTop}>
							{/* 로고 */}
							<View style={styles.clubLogo}>
								{club?.imageUri ? (
									<Image source={{ uri: club.imageUri }} style={styles.clubLogoImage} />
								) : null}
							</View>
							{/* 편집 아이콘 */}
							<View style={styles.editIconWrapper}>
								<Icon name="edit" size={ms(20)} color="#8F8686" style={{ opacity: 0.5 }} />
							</View>
						</View>
						{/* 텍스트 */}
						<View style={styles.clubTexts}>
							<Text style={styles.clubName} numberOfLines={1}>
								{club?.name ?? ''}
							</Text>
							<Text style={styles.clubCollege} numberOfLines={1}>
								{club?.college ?? ''}
							</Text>
							<Text style={styles.clubDesc} numberOfLines={1}>
								{club?.description ?? ''}
							</Text>
						</View>
					</View>
				</View>

				{/* 공고 관리 */}
				<View style={styles.section}>
					<View style={styles.sectionLabel}>
						<Text style={styles.sectionLabelText}>공고 관리</Text>
					</View>

					<View style={styles.listContainer}>
						{/* 새 공고 작성하기 버튼 */}
						<Pressable
							style={styles.newAnnouncementRow}
							onPress={() =>
								navigation.navigate(SCREEN_TYPE.ANNOUNCEMENT_REGISTRATION, { clubId })
							}>
							<Text style={styles.newAnnouncementText}>새 공고 작성하기</Text>
							<Icon name="edit" size={ms(16)} color={Colors.POINTCOLOR} />
						</Pressable>

						{/* 공고 목록 */}
						{isLoading ? (
							<ActivityIndicator color={Colors.POINTCOLOR} style={{ marginVertical: vs(16) }} />
						) : recruitments.length === 0 ? (
							<View style={[styles.row, styles.rowNormal]}>
								<Text style={styles.rowTextGray}>등록된 공고가 없어요</Text>
							</View>
						) : (
							<>
								{visibleRecruitments.map(item => (
									<View
										key={item.id}
										style={[styles.row, item.is_active ? styles.rowActive : styles.rowNormal]}>
										<View style={styles.rowLeft}>
											{item.is_active && (
												<View style={styles.badge}>
													<Text style={styles.badgeText}>현재 공고</Text>
												</View>
											)}
											<Text style={styles.rowTextGray} numberOfLines={1}>
												{item.display_title}
											</Text>
										</View>
										<View style={styles.rowIcons}>
											<Pressable hitSlop={8}>
												<Icon name="edit" size={ms(16)} color="#C1C1C1" />
											</Pressable>
											<Pressable hitSlop={8}>
												<Icon name="delete" size={ms(16)} color="#C1C1C1" />
											</Pressable>
										</View>
									</View>
								))}

								{/* 이전 공고 더보기 */}
								{hasMore && (
									<Pressable
										style={[styles.row, styles.rowMore]}
										onPress={() => setShowMore(prev => !prev)}>
										<Text style={styles.rowMoreText}>이전 공고 더보기</Text>
										<Icon
											name={showMore ? 'expand-less' : 'expand-more'}
											size={ms(18)}
											color={Colors.POINTCOLOR}
										/>
									</Pressable>
								)}
							</>
						)}
					</View>
				</View>

				{/* 운영진 목록 */}
				<View style={styles.section}>
					<View style={styles.sectionLabel}>
						<Text style={styles.sectionLabelText}>운영진 목록</Text>
					</View>
					<View style={styles.listContainer}>
						<View style={[styles.row, styles.rowNormal, { justifyContent: 'center' }]}>
							<Text style={styles.rowTextGray}>멤버 기능은 준비 중이에요</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default ClubManagementScreen

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F5F4F0',
	},

	// ── 헤더
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: s(20),
		gap: s(105),
		height: vs(39),
		backgroundColor: '#FFFFFF',
	},
	backBtn: {
		width: ms(24),
		height: ms(24),
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		fontFamily: 'Pretendard',
		fontWeight: '600',
		fontSize: ms(16),
		lineHeight: ms(19),
		letterSpacing: -0.02 * 16,
		color: '#757474',
	},

	// ── 스크롤 영역
	scroll: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: s(20),
		paddingTop: vs(10),
		paddingBottom: vs(40),
		gap: vs(20),
	},

	// ── 동아리 카드
	clubCard: {
		borderRadius: ms(12),
		overflow: 'hidden',
		height: vs(160),
	},
	clubCardBg: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	clubCardOverlay: {
		position: 'absolute',
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(255,255,255,0.45)',
	},
	clubCardContent: {
		flex: 1,
		padding: s(16),
		justifyContent: 'space-between',
	},
	clubCardTop: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	clubLogo: {
		width: ms(40),
		height: ms(40),
		borderRadius: ms(20),
		backgroundColor: '#D9D9D9',
		opacity: 0.7,
		overflow: 'hidden',
	},
	clubLogoImage: {
		width: '100%',
		height: '100%',
	},
	editIconWrapper: {
		width: ms(24),
		height: ms(24),
		justifyContent: 'center',
		alignItems: 'center',
	},
	clubTexts: {
		gap: vs(4),
	},
	clubName: {
		fontFamily: 'Pretendard',
		fontWeight: '700',
		fontSize: ms(20),
		lineHeight: ms(24),
		letterSpacing: -0.02 * 20,
		color: '#000000',
	},
	clubCollege: {
		fontFamily: 'Pretendard',
		fontWeight: '500',
		fontSize: ms(14),
		lineHeight: ms(17),
		letterSpacing: -0.02 * 14,
		color: '#757474',
	},
	clubDesc: {
		fontFamily: 'Pretendard',
		fontWeight: '500',
		fontSize: ms(14),
		lineHeight: ms(17),
		letterSpacing: -0.02 * 14,
		color: '#757474',
	},

	// ── 섹션
	section: {
		gap: 0,
	},
	sectionLabel: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: vs(5),
		paddingBottom: vs(5),
		paddingLeft: s(5),
		paddingRight: s(12),
		height: vs(34),
	},
	sectionLabelText: {
		fontFamily: 'Pretendard',
		fontWeight: '500',
		fontSize: ms(14),
		lineHeight: ms(24),
		color: '#757474',
		flex: 1,
	},

	// ── 리스트 컨테이너
	listContainer: {
		gap: vs(10),
	},

	// ── 새 공고 작성하기
	newAnnouncementRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: vs(10),
		paddingHorizontal: s(15),
		borderRadius: ms(12),
		minHeight: vs(34),
		backgroundColor: '#FFFFFF',
		borderWidth: 1,
		borderColor: Colors.POINTCOLOR,
	},
	newAnnouncementText: {
		fontFamily: 'Pretendard',
		fontWeight: '500',
		fontSize: ms(12),
		lineHeight: ms(14),
		letterSpacing: -0.02 * 12,
		color: '#AAAAAA',
	},

	// ── 공고 행 공통
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: vs(10),
		paddingHorizontal: s(15),
		borderRadius: ms(12),
		minHeight: vs(34),
	},
	rowNormal: {
		backgroundColor: '#FFFFFF',
	},
	rowActive: {
		backgroundColor: '#FFFFFF',
		minHeight: vs(48),
		paddingLeft: s(10),
	},
	rowMore: {
		backgroundColor: '#F3F0F5',
	},
	rowLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(10),
		flex: 1,
	},
	rowIcons: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(12),
		flexShrink: 0,
	},

	// ── 이전 공고 더보기
	rowMoreText: {
		fontFamily: 'Pretendard',
		fontWeight: '500',
		fontSize: ms(12),
		lineHeight: ms(14),
		letterSpacing: -0.02 * 12,
		color: Colors.POINTCOLOR,
	},

	// ── 현재 공고 배지
	badge: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: s(10),
		paddingVertical: vs(8),
		backgroundColor: Colors.POINTCOLOR,
		borderRadius: ms(12),
		width: ms(57),
		height: ms(28),
	},
	badgeText: {
		fontFamily: 'Pretendard',
		fontWeight: '600',
		fontSize: ms(10),
		lineHeight: ms(12),
		letterSpacing: -0.02 * 10,
		color: '#FFFFFF',
	},

	// ── 공고 제목 텍스트
	rowTextGray: {
		fontFamily: 'Pretendard',
		fontWeight: '500',
		fontSize: ms(12),
		lineHeight: ms(14),
		letterSpacing: -0.02 * 12,
		color: '#757474',
		flex: 1,
	},
})
