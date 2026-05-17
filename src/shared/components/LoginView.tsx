import appleAuth from '@invertase/react-native-apple-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { login as kakaoLogin } from '@react-native-seoul/kakao-login'
import { useQueryClient } from '@tanstack/react-query'
import { useProfile } from '@/shared/contexts/profileContext'
import { serviceContext } from '@/shared/contexts/serviceContext'
import React, { useContext } from 'react'
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import Toast from 'react-native-toast-message'
import { AuthProvider } from '@/usecases/auth'
import { LOGIN_TOKEN } from '@/shared/constants/localStorage'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

type Props = {
	closeBottomSheet: () => void
	onSuccess?: () => void
}

const LoginView = ({ closeBottomSheet, onSuccess }: Props) => {
	const queryClient = useQueryClient()
	const { setUser } = useProfile()
	const { authService, userService } = useContext(serviceContext)

	const handleLoginSuccess = async (token: string) => {
		await AsyncStorage.setItem(LOGIN_TOKEN, token)
		const user = await userService.getUser()
		setUser(user)
		closeBottomSheet()
		onSuccess?.()
		queryClient.invalidateQueries(['manageClubs'])
		Toast.show({ type: 'info', text1: '로그인 되었어요!', position: 'bottom' })
	}

	const onAppleButtonPress = async () => {
		try {
			const appleAuthRequestResponse = await appleAuth.performRequest({
				requestedOperation: appleAuth.Operation.LOGIN,
				requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
			})

			if (!appleAuthRequestResponse.identityToken) {
				return
			}

			const token = await authService.callback(
				AuthProvider.APPLE,
				appleAuthRequestResponse.identityToken,
			)
			await handleLoginSuccess(token)
		} catch {
			Toast.show({ type: 'info', text1: '로그인에 실패했어요!', position: 'bottom' })
		}
	}

	const onKakaoButtonPress = async () => {
		try {
			const result = await kakaoLogin()
			const token = await authService.callback(AuthProvider.KAKAO, result.accessToken)
			await handleLoginSuccess(token)
		} catch {
			Toast.show({ type: 'info', text1: '로그인에 실패했어요!', position: 'bottom' })
		}
	}

	return (
		<View style={styles.mainWrapper}>
			<View style={styles.titleWrapper}>
				<View style={styles.flexRow}>
					<Text style={styles.titleBold}>로그인</Text>
					<Text style={styles.titleRegular}>이 필요해요</Text>
				</View>
			</View>
			<View>
				<Pressable style={[styles.button, styles.kakao]} onPress={onKakaoButtonPress}>
					<Image source={require('@/assets/icons/kakao.png')} style={styles.icon} />
					<Text style={styles.kakaoText}>카카오톡으로 계속하기</Text>
				</Pressable>
				{Platform.OS === 'ios' && (
					<Pressable style={[styles.button, styles.apple]} onPress={onAppleButtonPress}>
						<Image source={require('@/assets/icons/apple.png')} style={styles.icon} />
						<Text style={styles.appleText}>Apple로 계속하기</Text>
					</Pressable>
				)}
			</View>
			<Pressable
				onPress={closeBottomSheet}
				style={({ pressed }) => [styles.bottomLink, { opacity: pressed ? 0.5 : 1 }]}>
				<View style={styles.linkUnderline}>
					<Text style={styles.link}>다음에 할게요</Text>
				</View>
			</Pressable>
		</View>
	)
}

export default LoginView

const styles = StyleSheet.create({
	flexRow: {
		flexDirection: 'row',
	},
	mainWrapper: {
		flex: 1,
		paddingVertical: vs(32),
		paddingHorizontal: s(24),
		backgroundColor: Colors.WHITE,
	},
	titleWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: vs(24),
	},
	titleBold: {
		...typography.headerL,
	},
	titleRegular: {
		...typography.headerL,
		fontFamily: 'Pretendard-Regular',
	},
	button: {
		padding: ms(16),
		borderRadius: ms(12),
		position: 'relative',
		marginBottom: vs(12),
	},
	icon: {
		width: s(24),
		height: vs(24),
		position: 'absolute',
		top: vs(13),
		left: s(16),
	},
	apple: {
		backgroundColor: Colors.BLACK,
	},
	appleText: {
		...typography.bodyMMedium,
		color: Colors.TEXT_BUTTON_SELECTED,
		textAlign: 'center',
	},
	kakao: {
		backgroundColor: '#FEE500', // 카카오 컬러
	},
	kakaoText: {
		...typography.bodyMMedium,
		color: Colors.BLACK,
		textAlign: 'center',
	},
	bottomLink: {
		marginTop: 'auto',
		alignSelf: 'center',
		marginBottom: vs(24),
	},
	linkUnderline: {
		borderBottomWidth: 1,
		borderBottomColor: Colors.BODYTEXT_SUB,
		paddingBottom: vs(0.5),
	},
	link: {
		...typography.bodyMRegular,
		marginTop: vs(12),
		color: Colors.BODYTEXT_SUB,
	},
})
