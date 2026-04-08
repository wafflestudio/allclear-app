import appleAuth from '@invertase/react-native-apple-authentication'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { login as kakaoLogin } from '@react-native-seoul/kakao-login'
import { useQueryClient } from '@tanstack/react-query'
import { useProfile } from 'shared/contexts/profileContext'
import { serviceContext } from 'shared/contexts/serviceContext'
import React, { useContext } from 'react'
import {
	Image,
	Platform,
	StyleSheet,
	Text,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import { AuthProvider } from 'usecases/auth'
import { LOGIN_TOKEN } from 'shared/constants/localStorage'

type Props = {
	closeBottomSheet: () => void
}

const LoginView = ({ closeBottomSheet }: Props) => {
	const queryClient = useQueryClient()
	const { setUser } = useProfile()
	const { authService, userService } = useContext(serviceContext)

	const onAppleButtonPress = async () => {
		// performs login request
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			// Note: it appears putting FULL_NAME first is important, see issue #293
			requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
		})

		// get current authentication state for user
		// /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
		const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)

		// use credentialState response to ensure the user is authenticated
		if (credentialState === appleAuth.State.AUTHORIZED && appleAuthRequestResponse.identityToken) {
			const token = await authService.callback(
				AuthProvider.APPLE,
				appleAuthRequestResponse.identityToken,
			)
			await AsyncStorage.setItem(LOGIN_TOKEN, token)
			const user = await userService.getUser()
			setUser(user)
			closeBottomSheet()
			queryClient.invalidateQueries(['manageClubs'])
		}
	}

	const onKakaoButtonPress = async () => {
		try {
			const result = await kakaoLogin()
			const token = await authService.callback(AuthProvider.KAKAO, result.accessToken)
			await AsyncStorage.setItem(LOGIN_TOKEN, token)
			const user = await userService.getUser()
			setUser(user)
			closeBottomSheet()
			queryClient.invalidateQueries(['manageClubs'])
		} catch (err) {
			Toast.show({
				type: 'info',
				text1: `로그인에 실패했어요! 잠시 후 다시 시도해주세요`,
				position: 'bottom',
			})
		}
	}

	return (
		<View style={styles.mainWrapper}>
			<View style={styles.titleWrapper}>
				<View style={styles.flexRow}>
					<Text style={[styles.title, styles.bold]}>로그인</Text>
					<Text style={styles.title}>이 필요해요</Text>
				</View>
			</View>
			<View>
				<TouchableOpacity
					style={[styles.button, styles.kakao]}
					onPress={() => onKakaoButtonPress()}>
					<Image source={require('../../../assets/icons/kakao.png')} style={styles.icon} />
					<Text style={styles.kakaoText}>카카오톡으로 계속하기</Text>
				</TouchableOpacity>
				{Platform.OS === 'ios' && (
					<TouchableOpacity
						style={[styles.button, styles.apple]}
						onPress={() => onAppleButtonPress()}>
						<Image source={require('../../../assets/icons/apple.png')} style={styles.icon} />
						<Text style={styles.appleText}>Apple로 계속하기</Text>
					</TouchableOpacity>
				)}
			</View>
			<View style={{ marginTop: 'auto' }}>
				<TouchableHighlight onPress={closeBottomSheet}>
					<Text style={styles.link}>상세 화면 돌아가기</Text>
				</TouchableHighlight>
			</View>
		</View>
	)
}

export default LoginView

const styles = StyleSheet.create({
	flexRow: {
		display: 'flex',
		flexDirection: 'row',
	},

	mainWrapper: {
		flex: 1,
		paddingVertical: 32,
		paddingHorizontal: 24,
		backgroundColor: 'white',
	},

	titleWrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24,
	},

	title: {
		fontSize: 16,
		lineHeight: 24,
	},

	bold: {
		fontWeight: 'bold',
	},

	button: {
		padding: 16,
		borderRadius: 12,
		display: 'flex',
		position: 'relative',
		marginBottom: 12,
	},

	icon: {
		width: 24,
		height: 24,
		position: 'absolute',
		top: 13,
		left: 16,
	},

	apple: {
		backgroundColor: '#000',
	},

	appleText: {
		color: '#fff',
		fontWeight: '500',
		textAlign: 'center',
	},

	kakao: {
		backgroundColor: '#FEE500',
	},

	kakaoText: {
		color: '#000',
		fontWeight: '500',
		textAlign: 'center',
	},

	link: {
		marginTop: 12,
		color: '#8F8686',
		fontSize: 14,
		lineHeight: 24,
		textAlign: 'center',
		textDecorationLine: 'underline',
	},
})
