import {
	createBottomTabNavigator,
	type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs'
import { Colors } from '@/shared/constants/colors'
import { useLoginBottomSheet } from '@/shared/contexts/loginBottomSheetContext'
import { useProfile } from '@/shared/contexts/profileContext'
import { Image, Pressable, type ImageSourcePropType } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HomeTab } from '@/tabs/HomeTab'
import { MyPageTab } from '@/tabs/MyPageTab'
import { RegisterClubTab } from '@/tabs/RegisterClubTab'
import { s, vs } from '@/shared/utils/scale'
import { navigation } from '@/shared/utils/navigation'
import { SavedTab } from './SaveTab'
import { SearchTab } from './SearchTab'
import { typography } from '@/shared/constants/typography'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Tab = createBottomTabNavigator()

const renderHomeTabIcon = createTabBarIcon(
	require('@/assets/icons/tab/home-default.png'),
	require('@/assets/icons/tab/home-active.png'),
)
const renderExploreTabIcon = createTabBarIcon(
	require('@/assets/icons/tab/explore-default.png'),
	require('@/assets/icons/tab/explore-active.png'),
)
const renderSavedTabIcon = createTabBarIcon(
	require('@/assets/icons/tab/saved-default.png'),
	require('@/assets/icons/tab/saved-active.png'),
)
const renderMyPageTabIcon = createTabBarIcon(
	require('@/assets/icons/tab/mypage-default.png'),
	require('@/assets/icons/tab/mypage-active.png'),
)

function renderRegisterClubIcon(): BottomTabNavigationOptions['tabBarIcon'] {
	return function TabBarIcon({ focused }) {
		return (
			<Icon
				name="add-circle-outline"
				size={s(24)}
				color={focused ? Colors.BUTTON_SELECTED : Colors.BUTTON_UNSELECTED}
				style={{ marginTop: vs(10) }}
			/>
		)
	}
}

function createTabBarIcon(
	defaultSource: ImageSourcePropType,
	activeSource: ImageSourcePropType,
): BottomTabNavigationOptions['tabBarIcon'] {
	return function TabBarIcon({ focused }) {
		return (
			<Image
				source={focused ? activeSource : defaultSource}
				style={{
					width: s(22),
					height: s(22),
					resizeMode: 'contain' as const,
					marginTop: vs(10),
				}}
			/>
		)
	}
}

export function TabNavigator() {
	const { user } = useProfile()
	const { openBottomSheet } = useLoginBottomSheet()
	const insets = useSafeAreaInsets()
	// 안드로이드 네비게이션바 있는 경우에만 inset 적용, 나머지는 전부 미적용
	const bottomInset = insets.bottom >= 40 ? insets.bottom : 0

	const screenOptions: BottomTabNavigationOptions = {
		headerShown: false,
		tabBarActiveTintColor: Colors.BUTTON_SELECTED,
		tabBarInactiveTintColor: Colors.BUTTON_UNSELECTED,
		tabBarStyle: {
			height: vs(70) + bottomInset,
			backgroundColor: Colors.BACKGROUND_SUB,
			borderTopWidth: 0, // iOS 그림자 제거
			elevation: 0, // Android 그림자 제거
			paddingBottom: vs(10) + bottomInset,
		},
		tabBarLabelStyle: {
			...typography.bodySMedium,
		},
		tabBarButton: props => (
			<Pressable
				{...props}
				style={({ pressed }) => [props.style, { opacity: pressed ? 0.6 : 1 }]}
			/>
		),
	}

	return (
		<Tab.Navigator screenOptions={screenOptions}>
			<Tab.Screen options={{ tabBarIcon: renderHomeTabIcon }} name="홈" component={HomeTab} />
			<Tab.Screen
				options={{ tabBarIcon: renderExploreTabIcon }}
				name="탐색"
				component={SearchTab}
			/>
			<Tab.Screen
				options={{ tabBarIcon: renderRegisterClubIcon(), tabBarStyle: { display: 'none' } }}
				name="등록"
				component={RegisterClubTab}
				// TODO: Re-enable login requirement after testing
				// listeners={{
				// 	tabPress: e => {
				// 		if (!user) {
				// 			e.preventDefault()
				// 			openBottomSheet(() => navigation.navigate('등록'))
				// 		}
				// 	},
				// }}
			/>
			<Tab.Screen
				options={{ tabBarIcon: renderSavedTabIcon }}
				name="저장"
				component={SavedTab}
				listeners={{
					tabPress: e => {
						if (!user) {
							e.preventDefault()
							openBottomSheet(() => navigation.navigate('저장'))
						}
					},
				}}
			/>
			<Tab.Screen
				options={{ tabBarIcon: renderMyPageTabIcon }}
				name="마이"
				component={MyPageTab}
				listeners={{
					tabPress: e => {
						if (!user) {
							e.preventDefault()
							openBottomSheet(() => navigation.navigate('마이'))
						}
					},
				}}
			/>
		</Tab.Navigator>
	)
}
