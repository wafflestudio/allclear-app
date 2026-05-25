import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Colors } from '@/shared/constants/colors'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import { navigation } from '@/shared/utils/navigation'
import Header from '@/shared/components/BackHeader'
import React, { useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import WebView, { WebViewMessageEvent } from 'react-native-webview'

type WebviewType = NativeStackScreenProps<StackParamList, SCREEN_TYPE.WEBVIEW>

const WebViewScreen = ({ route }: WebviewType) => {
	const { uri, title = '', authorization } = route.params

	const [isLoading, setLoading] = useState(true)

	const onMessage = (e: WebViewMessageEvent) => {
		const event = JSON.parse(e.nativeEvent.data)

		switch (event.method) {
			case 'CLOSE_WEBVIEW':
				return navigation.goBack()
		}
	}

	return (
		<SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
			<Header title={title} onBack={() => navigation.goBack()} />
			{isLoading && (
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color={Colors.POINTCOLOR} />
				</View>
			)}
			<WebView
				style={styles.webview}
				source={{
					uri,
					headers: authorization ? { 'x-authorization': `Bearer ${authorization}` } : {},
				}}
				onLoadStart={() => setLoading(true)}
				onLoadEnd={() => setLoading(false)}
				accessible
				onMessage={onMessage}
				sharedCookiesEnabled
				thirdPartyCookiesEnabled
				javaScriptEnabled
				javaScriptCanOpenWindowsAutomatically
				domStorageEnabled
				bounces={false}
				overScrollMode="never"
			/>
		</SafeAreaView>
	)
}

export default WebViewScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.WHITE,
	},
	webview: {
		flex: 1,
	},
	loadingContainer: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
})
