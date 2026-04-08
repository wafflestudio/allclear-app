import {
	createBottomTabNavigator,
	type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs'
import { Colors } from 'shared/constants/colors'
import { useLoginBottomSheet } from 'shared/contexts/loginBottomSheetContext'
import { useProfile } from 'shared/contexts/profileContext'
import { Image, type ImageSourcePropType } from 'react-native'
import { HomeTab } from './HomeTab'
import { MyPageTab } from './MyPageTab'
import { RankingTab } from './RankingTab'

const Tab = createBottomTabNavigator()

const renderHomeTabIcon = createTabBarIcon(require('../assets/images/tab/home.png'))
const renderRankingTabIcon = createTabBarIcon(require('../assets/images/tab/ranking.png'))
const renderMyPageTabIcon = createTabBarIcon(require('../assets/images/tab/mypage.png'))

const TAB_BAR_ICON_SIZE = 24

function createTabBarIcon(source: ImageSourcePropType): BottomTabNavigationOptions['tabBarIcon'] {
	return function TabBarIcon({ color }) {
		return (
			<Image
				source={source}
				style={{
					width: TAB_BAR_ICON_SIZE,
					height: TAB_BAR_ICON_SIZE,
					tintColor: color,
				}}
			/>
		)
	}
}

const screenOptions: BottomTabNavigationOptions = {
	headerShown: false,
	tabBarActiveTintColor: Colors.GRAY_50,
	tabBarInactiveTintColor: Colors.GRAY_30,
	tabBarShowLabel: false,
	tabBarStyle: {
		paddingHorizontal: 60,
		alignItems: 'center',
	},
}

export function TabNavigator() {
	const { user } = useProfile()
	const { openBottomSheet } = useLoginBottomSheet()

	return (
		<Tab.Navigator screenOptions={screenOptions}>
			<Tab.Screen options={{ tabBarIcon: renderHomeTabIcon }} name="HomeTab" component={HomeTab} />
			<Tab.Screen
				options={{ tabBarIcon: renderRankingTabIcon }}
				name="RankingTab"
				component={RankingTab}
			/>
			<Tab.Screen
				options={{ tabBarIcon: renderMyPageTabIcon }}
				name="MyPageTab"
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
