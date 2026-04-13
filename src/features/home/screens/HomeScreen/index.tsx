import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Colors } from '@/shared/constants/colors'
import { Club } from '@/entities/club'
import { SCREEN_TYPE, StackParamList } from '@/entities/screen'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import useClickEventLog from '@/shared/hooks/useClickEventLog'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CategoryBoard from '@/features/home/screens/HomeScreen/CategoryBoard'
import Header from '@/features/home/screens/HomeScreen/Header'
import RecommendClubs from '@/features/home/screens/HomeScreen/RecommendClubs'

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.HOME>
type DetailsScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.HOME>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const HomeScreen = ({ navigation }: Props) => {
	const { logClickEvent } = useClickEventLog()

	const handleMoveToDetailPage = (club: Club) => {
		logClickEvent({
			screen_name: 'home_screen',
			screen_component_name: 'rolling_banner_card',
			category: club.category,
		})

		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'home',
		})
	}

	return (
		<WithViewEventLog params={{ screen_name: 'home_screen' }}>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={{
					flex: 1,
					padding: 0,
					backgroundColor: Colors.WHITE,
				}}>
				<ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
					<Header />
					<CategoryBoard />
					<RecommendClubs openDetailPage={handleMoveToDetailPage} />
				</ScrollView>
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default HomeScreen
