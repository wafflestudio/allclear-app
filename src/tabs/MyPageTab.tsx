import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import AnnouncementEditScreen from '@/features/club/screens/AnnouncementEditScreen'
import AnnouncementRegistrationScreen from '@/features/club/screens/AnnouncementRegistrationScreen'
import ClubDetailScreen from '@/features/club/screens/ClubDetailScreen'
import ClubManagementScreen from '@/features/club/screens/ClubManagementScreen'
import SavedClubListScreen from '@/features/club/screens/SavedClubListScreen'
import EditProfileScreen from '@/features/mypage/screens/EditProfileScreen'
import MyPageScreen from '@/features/mypage/screens/MyPageScreen'
import WebViewScreen from '@/features/webview/screens/WebviewScreen'

const Stack = createNativeStackNavigator<StackParamList>()

export function MyPageTab() {
	return (
		<Stack.Navigator screenOptions={{ headerBackTitleVisible: false, headerShown: false }}>
			<Stack.Screen key={SCREEN_TYPE.MYPAGE} name={SCREEN_TYPE.MYPAGE} component={MyPageScreen} />
			<Stack.Screen
				key={SCREEN_TYPE.EDIT_PROFILE}
				name={SCREEN_TYPE.EDIT_PROFILE}
				component={EditProfileScreen}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.WEBVIEW}
				name={SCREEN_TYPE.WEBVIEW}
				component={WebViewScreen}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.SAVED_CLUB_LIST}
				name={SCREEN_TYPE.SAVED_CLUB_LIST}
				component={SavedClubListScreen}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.CLUB_DETAIL}
				name={SCREEN_TYPE.CLUB_DETAIL}
				component={ClubDetailScreen}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.ANNOUNCEMENT_REGISTRATION}
				name={SCREEN_TYPE.ANNOUNCEMENT_REGISTRATION}
				component={AnnouncementRegistrationScreen}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.CLUB_MANAGEMENT}
				name={SCREEN_TYPE.CLUB_MANAGEMENT}
				component={ClubManagementScreen}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.ANNOUNCEMENT_EDIT}
				name={SCREEN_TYPE.ANNOUNCEMENT_EDIT}
				component={AnnouncementEditScreen}
			/>
		</Stack.Navigator>
	)
}
