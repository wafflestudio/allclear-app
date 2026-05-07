import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import ClubDetailScreen from '@/features/club/screens/ClubDetailScreen'
import ClubRankingScreen from '@/features/club/screens/ClubRankingScreen'
import ClubReviewScreen from '@/features/club/screens/ClubReviewScreen'

const Stack = createNativeStackNavigator<StackParamList>()

export function RankingTab() {
	return (
		<Stack.Navigator screenOptions={{ headerBackTitleVisible: false, headerShown: false }}>
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
