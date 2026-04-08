import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ENV } from '@/config/ENV'
import { Colors } from '@/shared/constants/colors'
import { useManageClubBottomSheet } from '@/shared/contexts/manageClubBottomSheet'
import { useProfile } from '@/shared/contexts/profileContext'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { useUserVoiceBottomSheet } from '@/shared/contexts/userVoiceBottomSheetContext'
import { CategoryMap } from '@/entities/category'
import { Club } from '@/entities/club'
import { SCREEN_TYPE } from '@/entities/screen'
import React, { useContext } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import Toast from 'react-native-toast-message'
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { LOGIN_TOKEN } from '@/shared/constants/localStorage'
import { navigation } from '@/shared/utils/navigation'

const MyPageScreen = () => {
	const { authService } = useContext(serviceContext)
	const { openBottomSheet: openUserVoice } = useUserVoiceBottomSheet()
	const { openBottomSheet: openManageClub } = useManageClubBottomSheet()
	const queryClient = useQueryClient()

	const { user, setUser } = useProfile()
	const { data: manageClubs, isLoading: isLoadingManageClubs } = useManageClubs()
	const { data: myClubs } = useMyClubs()

	const extraClubsCount = myClubs && myClubs.length > 5 ? myClubs.length - 5 : 0

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
			text1: `회원 탈퇴 되었어요!`,
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
			text1: `로그아웃 되었어요!`,
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

	return (
		<SafeAreaView
			edges={['top', 'left', 'right']}
			style={{
				flex: 1,
				backgroundColor: '#F5F4F0',
			}}>
			<ScrollView style={{ padding: 16 }}>
				{user?.college && user?.major ? (
					<LinearGradient
						colors={['#3C367D', '#171437']}
						style={{ flex: 1, borderRadius: 12 }}
						start={{ x: 0.5, y: 0 }}
						end={{ x: 0.5, y: 1 }}>
						<LinearGradient
							colors={[
								'rgba(255, 255, 255, 0)',
								'rgba(255, 255, 255, 0.136)',
								'rgba(255, 255, 255, 0)',
							]}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							locations={[0.085, 0.5067, 0.7281]}
							style={{ flex: 1 }}>
							<View style={{ padding: 24 }}>
								<TouchableOpacity
									style={{ position: 'absolute', top: 24, right: 24 }}
									onPress={handleMoveEditProfilePage}>
									<Image
										source={require('@/assets/icons/edit-pencil.png')}
										style={{
											width: 24,
											height: 24,
										}}
									/>
								</TouchableOpacity>
								<Image
									source={require('@/assets/images/mypage/snu-profile-icon.png')}
									style={{
										width: 80,
										height: 80,
									}}
								/>
								<View style={{ marginTop: 24 }}>
									<Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.WHITE }}>
										{user?.nickname || '이름 정보가 없습니다'}
									</Text>
									<Text style={{ fontSize: 14, color: Colors.WHITE, opacity: 0.5, marginTop: 8 }}>
										{user?.college || '단과대 정보가 없습니다'}
										{user?.major && ' ' + user.major}
									</Text>
									<Text style={{ fontSize: 14, color: Colors.WHITE, opacity: 0.5, marginTop: 6 }}>
										{user?.admissionClass ? `${user.admissionClass} 학번` : '학번 정보가 없습니다'}
									</Text>
								</View>

								<View style={{ marginTop: 24 }}>
									<Text style={{ fontSize: 14, color: Colors.WHITE, opacity: 0.5, marginTop: 8 }}>
										{'활동한 동아리'}
									</Text>
									{myClubs && myClubs.length > 0 ? (
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												flexWrap: 'wrap',
												gap: 8,
												marginTop: 12,
											}}>
											{myClubs.slice(0, 5).map((club: Club, index) => (
												<TouchableOpacity
													key={index}
													onPress={() => {
														navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
															uuid: club.uuid,
															category: club.category,
														})
													}}>
													<View
														style={{
															display: 'flex',
															flexDirection: 'row',
															justifyContent: 'center',
															alignItems: 'center',
															paddingHorizontal: 8,
															paddingVertical: 4,
															borderRadius: 12,
															backgroundColor: '#ffffff1a',
														}}>
														<Image
															resizeMethod="resize"
															style={{ width: 24, height: 24 }}
															source={CategoryMap[club.category].coloredSource}
														/>
														<Text
															style={{
																color: Colors.WHITE,
																fontSize: 12,
																fontWeight: '600',
																marginLeft: 4,
															}}>
															{club.name}
														</Text>
													</View>
												</TouchableOpacity>
											))}
											{extraClubsCount > 0 && (
												<View style={{ marginLeft: 8 }}>
													<Text style={{ color: '#fff', fontSize: 16 }}>+{extraClubsCount}</Text>
												</View>
											)}
										</View>
									) : (
										<Text
											style={{
												fontSize: 14,
												color: Colors.WHITE,
												opacity: 1,
												marginTop: 8,
												fontWeight: '500',
											}}>
											{'활동한 동아리에 리뷰를 남겨주세요'}
										</Text>
									)}
								</View>
							</View>
						</LinearGradient>
					</LinearGradient>
				) : (
					<View style={styles.profileContainer}>
						<TouchableOpacity
							style={{ position: 'absolute', top: 24, right: 24 }}
							onPress={handleMoveEditProfilePage}>
							<Image
								source={require('@/assets/icons/edit-pencil.png')}
								style={{
									width: 24,
									height: 24,
								}}
							/>
						</TouchableOpacity>

						<Image
							source={require('@/assets/images/tab/snu.png')}
							style={{
								width: 40,
								height: 40,
							}}
						/>
						<View style={{ marginTop: 12 }}>
							<Text style={{ fontSize: 20, fontWeight: 'bold', color: '#8F8686' }}>
								{user?.nickname || '이름 정보가 없습니다'}
							</Text>
							<Text style={{ fontSize: 14, color: '#8F8686', marginTop: 8 }}>
								{user?.college || '단과대 정보가 없습니다'}
								{user?.major && ' ' + user.major}
							</Text>
							<Text style={{ fontSize: 14, color: '#8F8686', marginTop: 6 }}>
								{user?.admissionClass ? `${user.admissionClass} 학번` : '학번 정보가 없습니다'}
							</Text>
						</View>
					</View>
				)}

				{isLoadingManageClubs && (
					<View
						style={{
							marginTop: 16,
							padding: 24,
							borderRadius: 12,
							backgroundColor: 'white',
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
				)}

				{manageClubs && manageClubs.length > 0 && (
					<View style={{ marginTop: 16 }}>
						<View style={{ marginHorizontal: 8 }}>
							<Text style={{ color: '#8F8686' }}>관리 중인 동아리</Text>
						</View>
						<View
							style={{
								position: 'relative',
								padding: 24,
								marginTop: 12,
								borderRadius: 12,
								backgroundColor: 'white',
								display: 'flex',
								gap: 16,
							}}>
							{manageClubs.map(club => (
								<TouchableOpacity key={club.uuid} onPress={() => openManageClubDetailPage(club)}>
									<View
										style={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'space-between',
											paddingVertical: 4,
										}}>
										<Text style={{ color: '#3A3434' }}>{club.name}</Text>
										<Icon color={'#3A3434'} name="arrow-forward-ios" size={12} />
									</View>
								</TouchableOpacity>
							))}
							<TouchableOpacity onPress={handleManageClub}>
								<View
									style={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'space-between',
										paddingVertical: 4,
									}}>
									<Text style={{ color: '#C5BBB8' }}>{'관리 중인 동아리 추가하기'}</Text>
									<Icon color={'#C5BBB8'} name="add-circle-outline" size={16} />
								</View>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{manageClubs && manageClubs.length === 0 && (
					<View style={styles.managerContainer}>
						<Icon
							style={{ position: 'absolute', top: 33, right: 24 }}
							color={Colors.WHITE}
							name="arrow-forward-ios"
							size={16}
						/>
						<TouchableOpacity onPress={handleManageClub}>
							<Text style={{ color: '#FFFFFF', fontSize: 14, marginBottom: 4 }}>
								동아리 운영진이신가요?
							</Text>
							<Text style={{ color: '#ffffff', opacity: 0.4, fontSize: 12 }}>
								관리자 계정 활성화 요청하기
							</Text>
						</TouchableOpacity>
					</View>
				)}

				<View style={styles.optionContainer}>
					<TouchableOpacity onPress={handleMoveSavedClubListPage}>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingVertical: 4,
								paddingHorizontal: 8,
							}}>
							<View
								style={{
									display: 'flex',
									flexDirection: 'row',
									alignItems: 'center',
								}}>
								<IconMaterialCommunity
									color={Colors.GRAY_40}
									name="heart"
									size={16}
									style={{ marginRight: 4 }}
								/>
								<Text style={{ color: Colors.GRAY_40 }}>저장한 동아리</Text>
							</View>
							<Icon color={'#3A3434'} name="arrow-forward-ios" size={12} />
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.optionContainer}>
					<TouchableOpacity onPress={handleUserVoice}>
						<Text style={styles.option}>개발자에게 요청하기</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleLogout}>
						<Text style={[styles.option, { color: Colors.GRAY_20 }]}>로그아웃</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleLeave}>
						<Text style={[styles.option, { color: Colors.GRAY_20 }]}>회원탈퇴</Text>
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

const useMyClubs = () => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery(['myClubs'], () => clubService.listMyClubs(), {
		select: data => data.clubs,
	})

	return query
}

const styles = StyleSheet.create({
	profileContainer: {
		position: 'relative',
		padding: 24,
		marginTop: 16,
		borderRadius: 12,
		backgroundColor: 'white',
	},
	profileEditButton: {},
	managerContainer: {
		position: 'relative',
		padding: 24,
		marginTop: 16,
		borderRadius: 12,
		backgroundColor: '#3a3434',
	},
	managerEditButton: {},
	optionContainer: {
		padding: 16,
		marginTop: 16,
		borderRadius: 12,
		backgroundColor: 'white',
	},
	option: {
		paddingHorizontal: 8, // 16 + 8 = 24
		paddingVertical: 12,
		color: '#8F8686',
	},

	border: {
		borderBottomWidth: 1,
		borderColor: '#E6E0DF',
		width: 60,
		paddingBottom: 16,
		marginBottom: 16,
	},
	popupNickname: {
		fontSize: 16,
		fontWeight: '600',
		color: 'black',
	},
	manageClubs: {
		fontSize: 12,
		color: '#494141',
	},
	popupLogout: {
		fontSize: 12,
		color: '#494141',
	},
	popupLeave: {
		fontSize: 12,
		color: '#D84141',
	},
})
