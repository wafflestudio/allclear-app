import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginBottomSheetProvider } from 'contexts/loginBottomSheetContext'
import { ManageClubBottomSheetProvider } from 'contexts/manageClubBottomSheet'
import { ProfileProvider } from 'contexts/profileContext'
import { serviceContext } from 'contexts/serviceContext'
import { UserVoiceBottomSheetProvider } from 'contexts/userVoiceBottomSheetContext'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import Toast, { BaseToast, ToastConfig } from 'react-native-toast-message'
import { getAuthRepository } from 'repositories/auth'
import { getCategoryRepository } from 'repositories/category'
import { getClubRepository } from 'repositories/club'
import { getReviewRepository } from 'repositories/review'
import { getUserRepository } from 'repositories/user'
import { TabNavigator } from 'tabs'
import { getAuthService } from 'usecases/auth'
import { getCategoryService } from 'usecases/category'
import { getClubService } from 'usecases/club'
import { getEventLogService } from 'usecases/eventLog'
import { getReviewService } from 'usecases/review'
import { getUserService } from 'usecases/user'
import { _navigationRef, setIsNavigationReady } from 'utils/navigation'
import { SCREEN_TYPE } from 'entities/screen'

const linking = {
	prefixes: ['allclear://'],
	config: {
		screens: {
			'홈': {
				screens: {
					[SCREEN_TYPE.CLUB_DETAIL]: 'club/:category/:uuid',
				},
			},
		},
	},
}


const queryClient = new QueryClient()

function App(): React.JSX.Element {
	const { Provider: ServiceProvider } = serviceContext

	const authRepository = getAuthRepository()
	const categoryRepository = getCategoryRepository()
	const clubRepository = getClubRepository()
	const reviewRepository = getReviewRepository()
	const userRepository = getUserRepository()

	const authService = getAuthService({ repositories: [authRepository] })
	const categoryService = getCategoryService({ repositories: [categoryRepository] })
	const clubService = getClubService({ repositories: [clubRepository] })
	const eventLogService = getEventLogService()
	const reviewService = getReviewService({ repositories: [reviewRepository] })
	const userService = getUserService({ repositories: [userRepository] })

	const services = {
		authService,
		categoryService,
		clubService,
		eventLogService,
		reviewService,
		userService,
	}

	useEffect(() => {
		setIsNavigationReady(true)
		setTimeout(() => SplashScreen.hide(), 1000)
	}, [])

	return (
		<ServiceProvider value={services}>
			<QueryClientProvider client={queryClient}>
				<ProfileProvider>
					<SafeAreaProvider>
						<GestureHandlerRootView style={{ flex: 1 }}>
							<BottomSheetModalProvider>
								<LoginBottomSheetProvider>
									<UserVoiceBottomSheetProvider>
										<ManageClubBottomSheetProvider>
											<NavigationContainer 
												ref={_navigationRef}
												linking={linking}
											>
												<TabNavigator />
											</NavigationContainer>
										</ManageClubBottomSheetProvider>
									</UserVoiceBottomSheetProvider>
								</LoginBottomSheetProvider>
							</BottomSheetModalProvider>
						</GestureHandlerRootView>
					</SafeAreaProvider>
				</ProfileProvider>
			</QueryClientProvider>
			<Toast config={toastConfig} />
		</ServiceProvider>
	)
}

export default App

const toastConfig: ToastConfig = {
	info: props => (
		<BaseToast
			{...props}
			style={{
				backgroundColor: 'rgba(32, 30, 30, 0.80)',
				borderRadius: 12,
				paddingHorizontal: 8,
				paddingVertical: 8,
				borderLeftWidth: 0,
			}}
			text1Style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
			text2Style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}
		/>
	),
}
