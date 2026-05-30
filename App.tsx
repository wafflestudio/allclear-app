import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { NavigationContainer } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LoginBottomSheetProvider } from '@/shared/contexts/loginBottomSheetContext'
import { ManageClubBottomSheetProvider } from '@/shared/contexts/manageClubBottomSheet'
import { ProfileProvider } from '@/shared/contexts/profileContext'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { UserVoiceBottomSheetProvider } from '@/shared/contexts/userVoiceBottomSheetContext'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SplashScreen from 'react-native-splash-screen'
import Toast, { ToastConfig } from 'react-native-toast-message'
import { getAnnouncementRepository } from '@/repositories/announcement'
import { getAuthRepository } from '@/repositories/auth'
import { getCategoryRepository } from '@/repositories/category'
import { getClubRepository } from '@/repositories/club'
import { getRecentSearchRepository } from '@/repositories/recentSearch'
import { getRecruitmentRepository } from '@/repositories/recruitment'
import { getReviewRepository } from '@/repositories/review'
import { getTermRepository } from '@/repositories/term'
import { getUserRepository } from '@/repositories/user'
import { TabNavigator } from '@/tabs/TabNavigator'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AnnouncementRegistrationScreen from '@/features/club/screens/AnnouncementRegistrationScreen'
import AnnouncementEditScreen from '@/features/club/screens/AnnouncementEditScreen'
import { SCREEN_TYPE } from '@/shared/constants/screen'
import { getAnnouncementService } from '@/usecases/announcement'
import { getAuthService } from '@/usecases/auth'
import { getCategoryService } from '@/usecases/category'
import { getClubService } from '@/usecases/club'
import { getEventLogService } from '@/usecases/eventLog'
import { getRecentSearchService } from '@/usecases/recentSearch'
import { getRecruitmentService } from '@/usecases/recruitment'
import { getReviewService } from '@/usecases/review'
import { getTermService } from '@/usecases/term'
import { getUserService } from '@/usecases/user'
import { _navigationRef, setIsNavigationReady } from '@/shared/utils/navigation'
import { linking } from '@/config/linking'
import { initToken } from '@/shared/utils/api'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

const RootStack = createNativeStackNavigator()

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
	const recentSearchRepository = getRecentSearchRepository()
	const recruitmentRepository = getRecruitmentRepository()
	const reviewRepository = getReviewRepository()
	const termRepository = getTermRepository()
	const userRepository = getUserRepository()

	const announcementService = getAnnouncementService({ repositories: [announcementRepository] })
	const authService = getAuthService({ repositories: [authRepository] })
	const categoryService = getCategoryService({ repositories: [categoryRepository] })
	const clubService = getClubService({ repositories: [clubRepository] })
	const eventLogService = getEventLogService()
	const recentSearchService = getRecentSearchService({ repositories: [recentSearchRepository] })
	const recruitmentService = getRecruitmentService({ repositories: [recruitmentRepository] })
	const reviewService = getReviewService({ repositories: [reviewRepository] })
	const termService = getTermService({ repositories: [termRepository] })
	const userService = getUserService({ repositories: [userRepository] })

	const services = {
		announcementService,
		authService,
		categoryService,
		clubService,
		eventLogService,
		recentSearchService,
		recruitmentService,
		reviewService,
		termService,
		userService,
	}

	useEffect(() => {
		setIsNavigationReady(true)
		initToken()
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
												<RootStack.Navigator screenOptions={{ headerShown: false }}>
													<RootStack.Screen name="Main" component={TabNavigator} />
													<RootStack.Screen
														name={SCREEN_TYPE.ANNOUNCEMENT_REGISTRATION}
														component={AnnouncementRegistrationScreen}
													/>
													<RootStack.Screen
														name={SCREEN_TYPE.ANNOUNCEMENT_EDIT}
														component={AnnouncementEditScreen}
													/>
												</RootStack.Navigator>
											</NavigationContainer>
										</ManageClubBottomSheetProvider>
									</UserVoiceBottomSheetProvider>
								</LoginBottomSheetProvider>
							</BottomSheetModalProvider>
						</GestureHandlerRootView>
					</SafeAreaProvider>
				</ProfileProvider>
			</QueryClientProvider>
			<Toast config={toastConfig} visibilityTime={2000} position="bottom" />
		</ServiceProvider>
	)
}

export default App

const toastConfig: ToastConfig = {
	info: ({ text1 }) => (
		<View style={toastStyles.container}>
			<Text style={toastStyles.text} numberOfLines={1}>
				{text1}
			</Text>
		</View>
	),
}

const toastStyles = StyleSheet.create({
	container: {
		backgroundColor: Colors.BODYTEXT_MAIN,
		borderRadius: ms(100),
		paddingHorizontal: s(24),
		paddingVertical: vs(14),
		marginHorizontal: s(16),
		shadowColor: Colors.BLACK,
		shadowOffset: { width: 0, height: vs(4) },
		shadowOpacity: 0.12,
		shadowRadius: ms(12),
		elevation: 8,
	},
	text: {
		...typography.bodyMSemibold,
		color: Colors.WHITE,
		textAlign: 'center',
	},
})
