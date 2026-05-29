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
import { typography } from '@/shared/constants/typography'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { ms, s, vs } from '@/shared/utils/scale'
import { navigation } from '@/shared/utils/navigation'
import BackHeader from '@/shared/components/BackHeader'

type RouteProps = RouteProp<StackParamList, typeof SCREEN_TYPE.CLUB_MANAGEMENT>

const ClubManagementScreen = () => {
	const route = useRoute<RouteProps>()
	const { clubId } = route.params

	const { clubService, recruitmentService } = useContext(serviceContext)

	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

	const { data: clubData } = useQuery({
		queryKey: ['club', clubId],
		queryFn: () => clubService.getClub({ uuid: clubId }),
	})

	const { data: recruitmentsData, isLoading: isLoadingRecruitments } = useQuery({
		queryKey: ['clubRecruitments', clubId],
		queryFn: () => recruitmentService.listClubRecruitments({ clubId }),
	})

	const club = clubData
	const recruitments = recruitmentsData?.recruitments ?? []

	const toggleExpand = (id: string) => {
		setExpandedIds(prev => {
			const next = new Set(prev)
			if (next.has(id)) {
				next.delete(id)
			} else {
				next.add(id)
			}
			return next
		})
	}

	const formatYearMonth = (yearMonth: string) => {
		// yearMonth format: "YYYY-MM" or "YYYYMM"
		const cleaned = yearMonth.replace('-', '')
		if (cleaned.length === 6) {
			const year = cleaned.slice(0, 4)
			const month = parseInt(cleaned.slice(4, 6), 10)
			return `${year}년 ${month}월 공고`
		}
		return yearMonth
	}

	const isCurrentRecruitment = (yearMonth: string) => {
		const now = new Date()
		const currentYM = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
		const cleaned = yearMonth.replace('-', '')
		return cleaned === currentYM
	}

	return (
		<SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
			<BackHeader title="동아리 관리" onBack={() => navigation.goBack()} />

			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* 동아리 카드 */}
				<View style={styles.clubCard}>
					<View style={styles.clubCardLeft}>
						<View style={styles.clubLogoPlaceholder}>
							{club?.imageUri ? (
								<Image source={{ uri: club.imageUri }} style={styles.clubLogoImage} />
							) : null}
						</View>
						<View style={styles.clubInfo}>
							<Text style={styles.clubName} numberOfLines={1}>
								{club?.name ?? ''}
							</Text>
							<Text style={styles.clubSub} numberOfLines={1}>
								{club?.college ?? ''}
							</Text>
							<Text style={styles.clubSub} numberOfLines={1}>
								{club?.description ?? ''}
							</Text>
						</View>
					</View>
					<Pressable style={styles.editButton} hitSlop={8}>
						<Icon name="edit" size={ms(18)} color={Colors.BODYTEXT_SUB} style={{ opacity: 0.4 }} />
					</Pressable>
				</View>

				{/* 공고 목록 */}
				<View style={styles.section}>
					<View style={styles.sectionLabel}>
						<Text style={styles.sectionLabelText}>공고 목록</Text>
					</View>

					{isLoadingRecruitments ? (
						<ActivityIndicator color={Colors.POINTCOLOR} style={{ marginTop: vs(12) }} />
					) : recruitments.length === 0 ? (
						<View style={[styles.recruitmentRow, { justifyContent: 'center' }]}>
							<Text style={[styles.recruitmentTitle, { color: Colors.BODYTEXT_DISABLED }]}>
								등록된 공고가 없어요
							</Text>
						</View>
					) : (
						recruitments.map((item, index) => {
							const isCurrent = isCurrentRecruitment(item.year_month)
							const isExpanded = expandedIds.has(item.id)
							const isSelected = isCurrent || isExpanded

							return (
								<Pressable
									key={item.id}
									onPress={() => toggleExpand(item.id)}
									style={[
										styles.recruitmentRow,
										isSelected && styles.recruitmentRowSelected,
										isCurrent && styles.recruitmentRowCurrent,
										index === 0 && !isSelected && styles.recruitmentRowBorder,
									]}>
									<View style={styles.recruitmentLeft}>
										{isCurrent && (
											<View style={styles.currentBadge}>
												<Text style={styles.currentBadgeText}>현재 공고</Text>
											</View>
										)}
										<Text
											style={[
												styles.recruitmentTitle,
												isCurrent && styles.recruitmentTitleCurrent,
											]}>
											{formatYearMonth(item.year_month)}
										</Text>
									</View>
									<Icon
										name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
										size={ms(16)}
										color={isCurrent ? Colors.POINTCOLOR : Colors.BODYTEXT_DISABLED}
									/>
								</Pressable>
							)
						})
					)}
				</View>

				{/* 멤버 목록 */}
				<View style={styles.section}>
					<View style={styles.sectionLabel}>
						<Text style={styles.sectionLabelText}>멤버 목록</Text>
					</View>
					<View style={styles.memberCard}>
						<Text style={[styles.recruitmentTitle, { color: Colors.BODYTEXT_DISABLED }]}>
							멤버 기능은 준비 중이에요
						</Text>
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
		backgroundColor: Colors.BACKGROUND_SUB,
	},
	scrollContent: {
		paddingHorizontal: s(20),
		paddingTop: vs(12),
		paddingBottom: vs(40),
		gap: vs(20),
	},

	// 동아리 카드
	clubCard: {
		backgroundColor: Colors.WHITE,
		borderRadius: ms(12),
		paddingVertical: vs(30),
		paddingHorizontal: s(20),
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
	},
	clubCardLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(15),
		flex: 1,
	},
	clubLogoPlaceholder: {
		width: ms(41),
		height: ms(41),
		borderRadius: ms(8),
		backgroundColor: '#EAEAEA',
		overflow: 'hidden',
	},
	clubLogoImage: {
		width: '100%',
		height: '100%',
	},
	clubInfo: {
		flex: 1,
		gap: vs(5),
	},
	clubName: {
		...typography.headerXL,
		color: Colors.BODYTEXT_MAIN,
		letterSpacing: -0.02 * 20,
	},
	clubSub: {
		...typography.bodyMRegular,
		color: Colors.BODYTEXT_SUB,
		letterSpacing: -0.02 * 14,
	},
	editButton: {
		padding: s(4),
	},

	// 섹션
	section: {
		gap: vs(10),
	},
	sectionLabel: {
		paddingHorizontal: s(5),
		paddingVertical: vs(5),
	},
	sectionLabelText: {
		...typography.bodyMMedium,
		color: Colors.BODYTEXT_SUB,
		letterSpacing: -0.02 * 14,
	},

	// 공고 목록 행
	recruitmentRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: vs(10),
		paddingHorizontal: s(15),
		backgroundColor: Colors.WHITE,
		borderRadius: ms(12),
		minHeight: vs(34),
	},
	recruitmentRowBorder: {
		borderWidth: 1,
		borderColor: Colors.POINTCOLOR,
	},
	recruitmentRowSelected: {
		backgroundColor: Colors.BACKGROUND_SUB,
	},
	recruitmentRowCurrent: {
		backgroundColor: Colors.WHITE,
		minHeight: vs(48),
	},
	recruitmentLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(10),
	},
	currentBadge: {
		backgroundColor: Colors.POINTCOLOR,
		borderRadius: ms(12),
		paddingHorizontal: s(10),
		paddingVertical: vs(8),
	},
	currentBadgeText: {
		...typography.bodyXSSemibold,
		color: Colors.WHITE,
		letterSpacing: -0.02 * 10,
	},
	recruitmentTitle: {
		...typography.bodySMedium,
		color: Colors.BODYTEXT_SUB,
		letterSpacing: -0.02 * 12,
	},
	recruitmentTitleCurrent: {
		color: Colors.BODYTEXT_SUB,
	},

	// 멤버
	memberCard: {
		backgroundColor: Colors.WHITE,
		borderRadius: ms(12),
		paddingVertical: vs(15),
		paddingHorizontal: s(15),
		alignItems: 'center',
	},
})
