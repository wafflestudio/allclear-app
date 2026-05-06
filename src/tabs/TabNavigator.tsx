import {
	createBottomTabNavigator,
	type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs'
import { Colors } from '@/shared/constants/colors'
import { useLoginBottomSheet } from '@/shared/contexts/loginBottomSheetContext'
import { useProfile } from '@/shared/contexts/profileContext'
import { Image, Pressable, type ImageSourcePropType } from 'react-native'
import { HomeTab } from '@/tabs/HomeTab'
import { MyPageTab } from '@/tabs/MyPageTab'
import { s, vs } from '@/shared/utils/scale'
import { SavedTab } from './SaveTab'
import { RankingTab } from './RankingTab'
import { typography } from '@/shared/constants/typography'

const Tab = createBottomTabNavigator()

const renderHomeTabIcon = createTabBarIcon(require('@/assets/icons/tab/home.png'))
const renderExploreTabIcon = createTabBarIcon(require('@/assets/icons/tab/explore.png'))
const renderSavedTabIcon = createTabBarIcon(require('@/assets/icons/tab/saved.png'))
const renderMyPageTabIcon = createTabBarIcon(require('@/assets/icons/tab/mypage.png'))

function createTabBarIcon(source: ImageSourcePropType): BottomTabNavigationOptions['tabBarIcon'] {
	return function TabBarIcon({ color }) {
		return (
			<Image
				source={source}
				style={{
					width: s(22),
					height: s(22),
					tintColor: color,
					resizeMode: 'contain' as const,
					marginTop: vs(10),
				}}
			/>
		)
	}
}

const screenOptions: BottomTabNavigationOptions = {
	headerShown: false,
	tabBarActiveTintColor: Colors.BUTTON_SELECTED,
	tabBarInactiveTintColor: Colors.BUTTON_UNSELECTED,
	tabBarStyle: {
		height: vs(80),
		backgroundColor: Colors.BACKGROUND_SUB,
		borderTopWidth: 0, // iOS 그림자 제거
		elevation: 0, // Android 그림자 제거
	},
	tabBarLabelStyle: {
		...typography.bodySMedium,
	},
	tabBarButton: props => (
		<Pressable {...props} style={({ pressed }) => [props.style, { opacity: pressed ? 0.6 : 1 }]} />
	),
}

export function TabNavigator() {
	const { user } = useProfile()
	const { openBottomSheet } = useLoginBottomSheet()

	return (
		<Tab.Navigator screenOptions={screenOptions}>
			<Tab.Screen options={{ tabBarIcon: renderHomeTabIcon }} name="홈" component={HomeTab} />
			<Tab.Screen
				options={{ tabBarIcon: renderExploreTabIcon }}
				name="탐색"
				component={RankingTab}
			/>
			<Tab.Screen options={{ tabBarIcon: renderSavedTabIcon }} name="저장" component={SavedTab} />
			<Tab.Screen
				options={{ tabBarIcon: renderMyPageTabIcon }}
				name="마이"
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
