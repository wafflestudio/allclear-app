import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginBottomSheetProvider } from '@/shared/contexts/loginBottomSheetContext'
import { ManageClubBottomSheetProvider } from '@/shared/contexts/manageClubBottomSheet'
import { ProfileProvider } from '@/shared/contexts/profileContext'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { UserVoiceBottomSheetProvider } from '@/shared/contexts/userVoiceBottomSheetContext'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import Toast, { BaseToast, ToastConfig } from 'react-native-toast-message'
import { getAnnouncementRepository } from '@/repositories/announcement'
import { getAuthRepository } from '@/repositories/auth'
import { getCategoryRepository } from '@/repositories/category'
import { getClubRepository } from '@/repositories/club'
import { getReviewRepository } from '@/repositories/review'
import { getTermRepository } from '@/repositories/term'
import { getUserRepository } from '@/repositories/user'
import { TabNavigator } from '@/tabs/TabNavigator'
import { getAnnouncementService } from '@/usecases/announcement'
import { getAuthService } from '@/usecases/auth'
import { getCategoryService } from '@/usecases/category'
import { getClubService } from '@/usecases/club'
import { getEventLogService } from '@/usecases/eventLog'
import { getReviewService } from '@/usecases/review'
import { getTermService } from '@/usecases/term'
import { getUserService } from '@/usecases/user'
import { _navigationRef, setIsNavigationReady } from '@/shared/utils/navigation'
import { SCREEN_TYPE } from '@/entities/screen'
import { ENV } from '@/config/ENV'

const linking = {
	prefixes: ['allclear://', 'https://all-clear.cc', 'https://dev.all-clear.cc', ENV.WEB_URL],
	config: {
		screens: {
			HomeTab: {
				screens: {
					[SCREEN_TYPE.CLUB_DETAIL]: 'club/:uuid',
				},
			},
		},
	},
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
			cacheTime: 10 * 60 * 1000,
		},
	},
})

function App(): React.JSX.Element {
	const { Provider: ServiceProvider } = serviceContext

	const announcementRepository = getAnnouncementRepository()
	const authRepository = getAuthRepository()
	const categoryRepository = getCategoryRepository()
	const clubRepository = getClubRepository()
	const reviewRepository = getReviewRepository()
	const termRepository = getTermRepository()
	const userRepository = getUserRepository()

	const announcementService = getAnnouncementService({ repositories: [announcementRepository] })
	const authService = getAuthService({ repositories: [authRepository] })
	const categoryService = getCategoryService({ repositories: [categoryRepository] })
	const clubService = getClubService({ repositories: [clubRepository] })
	const eventLogService = getEventLogService()
	const reviewService = getReviewService({ repositories: [reviewRepository] })
	const termService = getTermService({ repositories: [termRepository] })
	const userService = getUserService({ repositories: [userRepository] })

	const services = {
		announcementService,
		authService,
		categoryService,
		clubService,
		eventLogService,
		reviewService,
		termService,
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
											<NavigationContainer ref={_navigationRef} linking={linking}>
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
