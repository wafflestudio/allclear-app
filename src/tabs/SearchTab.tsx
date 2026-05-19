import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import SearchScreen from '@/features/club/screens/SearchScreen'
import ClubDetailScreen from '@/features/club/screens/ClubDetailScreen'
import ClubReviewScreen from '@/features/club/screens/ClubReviewScreen'
import ClubRankingScreen from '@/features/club/screens/ClubRankingScreen'

const Stack = createNativeStackNavigator<StackParamList>()

export function SearchTab() {
	return (
		<Stack.Navigator screenOptions={{ headerBackTitleVisible: false, headerShown: false }}>
			<Stack.Screen
				key={SCREEN_TYPE.SEARCH}
				name={SCREEN_TYPE.SEARCH}
				component={SearchScreen}
				options={{ animation: 'none' }}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.CLUB_RANKING}
				name={SCREEN_TYPE.CLUB_RANKING}
				component={ClubRankingScreen}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.CLUB_DETAIL}
				name={SCREEN_TYPE.CLUB_DETAIL}
				component={ClubDetailScreen}
			/>
			<Stack.Screen
				key={SCREEN_TYPE.CLUB_REVIEW}
				name={SCREEN_TYPE.CLUB_REVIEW}
				component={ClubReviewScreen}
			/>
		</Stack.Navigator>
	)
}