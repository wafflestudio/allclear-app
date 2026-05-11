import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ENV } from '@/config/ENV'
import { Club } from '@/entities/club'
import { SCREEN_TYPE } from '@/shared/constants/screen'
import { useManageClubBottomSheet } from '@/shared/contexts/manageClubBottomSheet'
import { useProfile } from '@/shared/contexts/profileContext'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { useUserVoiceBottomSheet } from '@/shared/contexts/userVoiceBottomSheetContext'
import { LOGIN_TOKEN } from '@/shared/constants/localStorage'
import { navigation } from '@/shared/utils/navigation'
import React, { useContext } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import Toast from 'react-native-toast-message'
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'

const MyPageScreen = () => {
	const { authService, termService } = useContext(serviceContext)
	const { openBottomSheet: openUserVoice } = useUserVoiceBottomSheet()
	const { openBottomSheet: openManageClub } = useManageClubBottomSheet()
	const queryClient = useQueryClient()

	const { user, setUser } = useProfile()
	const { data: manageClubs, isLoading: isLoadingManageClubs } = useManageClubs()

	const handleLeave = () => {
		Alert.alert(
			'회원 탈퇴',
			'정말로 탈퇴하시겠습니까?',
			[
				{ text: '취소', style: 'cancel' },
				{
					text: '탈퇴',
					onPress: () => confirmLeave(),
				},
			],
			{ cancelable: false },
		)
	}

	const confirmLeave = async () => {
		await authService.leave()
		setUser(null)

		Toast.show({
			type: 'info',
			text1: '회원 탈퇴 되었어요!',
			position: 'top',
			topOffset: 60,
			visibilityTime: 2000,
		})
		queryClient.invalidateQueries(['manageClubs'])
	}

	const openManageClubDetailPage = async (club: Club) => {
		const authorization = await AsyncStorage.getItem(LOGIN_TOKEN)

		if (!authorization) return

		navigation.navigate(SCREEN_TYPE.WEBVIEW, {
			uri: ENV.WEB_URL + '/c/edit/' + club.uuid,
			authorization,
		})
	}

	const handleMoveEditProfilePage = () => {
		navigation.navigate(SCREEN_TYPE.EDIT_PROFILE)
	}

	const handleLogout = () => {
		Alert.alert(
			'로그아웃',
			'로그아웃 하시겠습니까?',
			[
				{
					text: '취소',
					style: 'cancel',
				},
				{
					text: '로그아웃',
					onPress: () => confirmLogout(),
				},
			],
			{ cancelable: false },
		)
	}

	const confirmLogout = async () => {
		await authService.logout()
		setUser(null)
		queryClient.invalidateQueries(['manageClubs'])
		navigation.navigate(SCREEN_TYPE.HOME)
		Toast.show({
			type: 'info',
			text1: '로그아웃 되었어요!',
			position: 'bottom',
			visibilityTime: 2000,
		})
	}

	const handleUserVoice = () => {
		openUserVoice()
	}

	const handleManageClub = () => {
		openManageClub()
	}

	const handleMoveSavedClubListPage = () => {
		navigation.navigate(SCREEN_TYPE.SAVED_CLUB_LIST)
	}

	const handleOpenTerm = async (type: 'service' | 'privacy') => {
		try {
			const response = await termService.listTerms()
			const terms = response?.data ?? []

			const matcher = type === 'service' ? /service|terms|서비스|이용/i : /privacy|개인정보/i
			const target = terms.find(term => matcher.test(`${term.termsKey} ${term.title}`))

			if (!target?.contentUrl) {
				Toast.show({
					type: 'info',
					text1: '약관 정보를 불러오지 못했어요',
					position: 'bottom',
					visibilityTime: 2000,
				})
				return
			}

			navigation.navigate(SCREEN_TYPE.WEBVIEW, {
				uri: target.contentUrl,
			})
		} catch {
			Toast.show({
				type: 'info',
				text1: '약관 정보를 불러오지 못했어요',
				position: 'bottom',
				visibilityTime: 2000,
			})
		}
	}

	return (
		<SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
			<ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
				<View style={styles.profileCard}>
					<TouchableOpacity style={styles.profileEditButton} onPress={handleMoveEditProfilePage}>
						<Image source={require('@/assets/icons/edit-pencil.png')} style={styles.profileEditIcon} />
					</TouchableOpacity>

						<Image source={require('@/assets/images/mypage/snu-profile-icon.png')} style={styles.profileIcon} />
					<View style={styles.profileTextGroup}>
						<Text style={styles.profileName}>{user?.nickname || '이름 정보가 없습니다'}</Text>
						<Text style={styles.profileSubText}>
							{user?.college || '단과대 정보가 없습니다'}
							{user?.major && ` ${user.major}`}
						</Text>
						<Text style={styles.profileSubText}>
							{user?.admissionClass ? `${user.admissionClass} 학번` : '학번 정보가 없습니다'}
						</Text>
					</View>
				</View>

				{isLoadingManageClubs && (
					<View style={styles.loadingCard}>
						<SkeletonPlaceholder borderRadius={4}>
							<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
								<SkeletonPlaceholder.Item>
									<SkeletonPlaceholder.Item width={220} height={16} />
									<SkeletonPlaceholder.Item marginTop={8} width={180} height={12} />
								</SkeletonPlaceholder.Item>
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder>
					</View>
				)}

				{manageClubs && manageClubs.length > 0 && (
					<View style={styles.whiteCard}>
						{manageClubs.map(club => (
							<TouchableOpacity
								key={club.uuid}
								onPress={() => openManageClubDetailPage(club)}
								style={styles.rowTouchable}>
								<View style={styles.defaultRow}>
									<Text style={styles.defaultRowText}>{club.name}</Text>
									<Icon color="#8F8686" name="arrow-forward-ios" size={12} />
								</View>
							</TouchableOpacity>
						))}
						<TouchableOpacity onPress={handleManageClub} style={styles.rowTouchable}>
							<View style={styles.defaultRow}>
								<Text style={styles.defaultRowMutedText}>관리 중인 동아리 추가하기</Text>
								<Icon color="#8F8686" name="add-circle-outline" size={16} />
							</View>
						</TouchableOpacity>
					</View>
				)}


				<TouchableOpacity onPress={handleManageClub} style={styles.managerPromptCard}>
					<View>
						<Text style={styles.managerPromptTitle}>동아리 운영진이신가요?</Text>
						<Text style={styles.managerPromptSubtitle}>동아리 등록하기</Text>
					</View>
					<Icon color="#874FFF" name="arrow-forward-ios" size={12} />
				</TouchableOpacity>

				<TouchableOpacity style={styles.savedClubCard} onPress={handleMoveSavedClubListPage}>
					<View style={styles.savedLeftBox}>
						<IconMaterialCommunity color="#874FFF" name="heart" size={16} style={styles.heartIcon} />
						<Text style={styles.savedText}>저장한 동아리</Text>
					</View>
					<Icon color="#874FFF" name="arrow-forward-ios" size={12} />
				</TouchableOpacity>

				<View style={styles.whiteCardLarge}>
					<TouchableOpacity onPress={handleUserVoice} style={styles.optionTouchable}>
						<Text style={styles.optionText}>개발자에게 요청하기</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleOpenTerm('service')} style={styles.optionTouchable}>
						<Text style={styles.optionText}>서비스 약관</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => handleOpenTerm('privacy')} style={styles.optionTouchable}>
						<Text style={styles.optionText}>개인정보 처리방침</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.whiteCardLarge}>
					<TouchableOpacity onPress={handleLogout} style={styles.optionTouchable}>
						<Text style={styles.optionText}>로그아웃</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleLeave} style={styles.optionTouchable}>
						<Text style={styles.optionText}>회원탈퇴</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default MyPageScreen

const useManageClubs = () => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery(['manageClubs'], () => clubService.listManageClubs(), {
		select: data => data.clubs,
	})

	return query
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F5F4F0',
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 24,
		gap: 15,
	},
	profileCard: {
		position: 'relative',
		padding: 24,
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
	},
	profileEditButton: {
		position: 'absolute',
		top: 24,
		right: 20,
		padding: 4,
	},
	profileEditIcon: {
		width: 24,
		height: 24,
		opacity: 0.4,
	},
	profileIcon: {
		width: 40,
		height: 40,
		opacity: 0.34,
	},
	profileTextGroup: {
		marginTop: 12,
		gap: 8,
	},
	profileName: {
		fontSize: 20,
		fontWeight: '700',
		color: '#3A3434',
		letterSpacing: -0.4,
	},
	profileSubText: {
		fontSize: 14,
		fontWeight: '500',
		color: '#8F8686',
		opacity: 0.6,
		letterSpacing: -0.28,
	},
	loadingCard: {
		padding: 24,
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
	},
	whiteCard: {
		paddingVertical: 12,
		paddingHorizontal: 24,
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		gap: 8,
	},
	whiteCardLarge: {
		padding: 24,
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		gap: 24,
	},
	rowTouchable: {
		paddingVertical: 4,
	},
	defaultRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	defaultRowText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#8F8686',
	},
	defaultRowMutedText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#8F8686',
		opacity: 0.7,
	},
	managerPromptCard: {
		paddingVertical: 20,
		paddingLeft: 24,
		paddingRight: 20,
		borderRadius: 12,
		backgroundColor: '#FAFAFA',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	managerPromptTitle: {
		fontSize: 14,
		fontWeight: '500',
		color: '#874FFF',
		letterSpacing: -0.28,
	},
	managerPromptSubtitle: {
		marginTop: 4,
		fontSize: 12,
		fontWeight: '400',
		color: '#874FFF',
		opacity: 0.4,
		letterSpacing: -0.24,
	},
	savedClubCard: {
		height: 56,
		paddingHorizontal: 20,
		borderRadius: 12,
		backgroundColor: '#FFFFFF',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	savedLeftBox: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	heartIcon: {
		marginRight: 4,
	},
	savedText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#874FFF',
		letterSpacing: -0.24,
	},
	optionTouchable: {
		paddingVertical: 2,
	},
	optionText: {
		fontSize: 12,
		fontWeight: '500',
		color: '#8F8686',
		letterSpacing: -0.24,
	},
})
