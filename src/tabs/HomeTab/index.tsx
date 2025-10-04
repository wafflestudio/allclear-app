import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SCREEN_TYPE, StackParamList } from 'entities/screen'
import React from 'react'
import ClubDetailScreen from 'screens/ClubDetailScreen'
import ClubListScreen from 'screens/ClubListScreen'
import ClubReviewScreen from 'screens/ClubReviewScreen'
import HomeScreen from 'screens/HomeScreen'
import SearchResultClubListScreen from 'screens/SearchResultClubListScreen'

const Stack = createNativeStackNavigator<StackParamList>()

export function HomeTab() {
	return (
		<Stack.Navigator screenOptions={{ headerBackTitleVisible: false, headerShown: false }}>
			<Stack.Screen key={SCREEN_TYPE.HOME} name={SCREEN_TYPE.HOME} component={HomeScreen} />
			<Stack.Screen
				key={SCREEN_TYPE.CLUB_LIST}
				name={SCREEN_TYPE.CLUB_LIST}
				component={ClubListScreen}
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
			<Stack.Screen
				key={SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST}
				name={SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST}
				component={SearchResultClubListScreen}
			/>
		</Stack.Navigator>
	)
}
