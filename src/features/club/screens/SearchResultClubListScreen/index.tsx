import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { Club } from '@/entities/club'
import { SCREEN_TYPE, StackParamList } from '@/entities/screen'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/features/club/components/ClubList/Header'
import ClubList from '@/features/club/components/ClubList/ClubList'

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST>
type DetailsScreenNavigationProp = NativeStackNavigationProp<
	StackParamList,
	SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST
>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const SearchResultClubListScreen = ({ route, navigation }: Props) => {
	const { query } = route.params
	const { data: clubs } = useCategoryClubs({ query })

	const openDetailPage = (club: Club) => {
		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'search_result',
		})
	}

	const handleMoveToHomePage = () => {
		navigation.navigate(SCREEN_TYPE.HOME)
	}

	return (
		<WithViewEventLog
			params={{
				screen_name: 'search_result_screen',
				search_query: query,
			}}>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={{ flex: 1, backgroundColor: Colors.WHITE, overflow: 'scroll' }}>
				<Header title="검색 결과" onBack={handleMoveToHomePage} />
				<ClubList clubs={clubs} openDetailPage={openDetailPage} />
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default SearchResultClubListScreen

type UseCategoryClubsProps = {
	query: string
}

const useCategoryClubs = ({ query }: UseCategoryClubsProps) => {
	const { clubService } = useContext(serviceContext)

	return useQuery(['clubs', query], () => clubService.searchClubs({ query }), {
		keepPreviousData: true,
		select: data => data.clubs,
	})
}
