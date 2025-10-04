import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useLoginBottomSheet } from 'contexts/loginBottomSheetContext'
import { useProfile } from 'contexts/profileContext'
import React from 'react'
import { Image } from 'react-native'
import { HomeTab } from './HomeTab'
import { MyPageTab } from './MyPageTab'
import { RankingTab } from './RankingTab'

const Tab = createBottomTabNavigator()

export function TabNavigator() {
	const { user } = useProfile()
	const { openBottomSheet } = useLoginBottomSheet()

	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: '#0070f3',
				tabBarInactiveTintColor: 'gray',
				tabBarLabelStyle: { fontSize: 10 },
				tabBarShowLabel: false,
				tabBarStyle: {
					paddingHorizontal: 60,
					alignItems: 'center',
				},
			}}>
			<Tab.Screen options={{ tabBarIcon: renderHomeTabIcon }} name="홈" component={HomeTab} />
			<Tab.Screen
				options={{ tabBarIcon: renderRankingTabIcon }}
				name="랭킹"
				component={RankingTab}
			/>
			<Tab.Screen
				options={{ tabBarIcon: renderMyPageTabIcon }}
				name="내 정보"
				component={MyPageTab}
				listeners={{
					tabPress: e => {
						if (!user) {
							e.preventDefault()
							openBottomSheet()
						}
					},
				}}
			/>
		</Tab.Navigator>
	)
}

function renderHomeTabIcon({ focused }: { focused: boolean }) {
	return (
		<Image
			source={require('../assets/images/tab/home.png')}
			style={{
				width: 24,
				height: 24,
				tintColor: focused ? '#3A3434' : '#C5BBB8',
			}}
		/>
	)
}

function renderRankingTabIcon({ focused }: { focused: boolean }) {
	return (
		<Image
			source={require('../assets/images/tab/ranking.png')}
			style={{
				width: 24,
				height: 24,
				tintColor: focused ? '#3A3434' : '#C5BBB8',
			}}
		/>
	)
}

function renderMyPageTabIcon({ focused }: { focused: boolean }) {
	return (
		<Image
			source={require('../assets/images/tab/mypage.png')}
			style={{
				width: 24,
				height: 24,
				tintColor: focused ? '#3A3434' : '#C5BBB8',
			}}
		/>
	)
}
