import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import type { SearchClubsRequest } from '@/repositories/club'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { Club } from '@/entities/club'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
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
	const { request } = route.params
	const { data: clubs } = useSearchClubs({ request })

	const openDetailPage = (club: Club) => {
		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'search_result',
		})
	}

	const handleGoBack = () => {
		navigation.goBack()
	}

	return (
		<WithViewEventLog
			params={{
				screen_name: 'search_result_screen',
				search_query: request.query,
			}}>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={{ flex: 1, backgroundColor: Colors.WHITE, overflow: 'scroll' }}>
				<Header title="검색 결과" onBack={handleGoBack} />
				<ClubList
					clubs={clubs}
					openDetailPage={openDetailPage}
					emptyPlaceholder="앗 검색 결과가 없어요!\n다른 키워드로 검색해주세요"
				/>
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default SearchResultClubListScreen

type UseCategoryClubsProps = {
	request: SearchClubsRequest
}

const useSearchClubs = ({ request }: UseCategoryClubsProps) => {
	const { clubService } = useContext(serviceContext)

	return useQuery(['clubs', 'search', request], () => clubService.searchClubs(request), {
		keepPreviousData: true,
		select: data => data.clubs,
	})
}
