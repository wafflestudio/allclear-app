import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { Colors } from 'constants/colors'
import { serviceContext } from 'contexts/serviceContext'
import { Club } from 'entities/club'
import { SCREEN_TYPE, StackParamList } from 'entities/screen'
import WithViewEventLog from 'hocs/WithViewEventLog'
import React, { useContext } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClubListItem from 'screens/components/ClubListItem'
import Header from './Header'

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST>
type DetailsScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.HOME>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const SearchResultClubListScreen = ({ route, navigation }: Props) => {
	const { query } = route.params as DetailsScreenRouteProp['params']
	const { data: categoryClubs } = useCategoryClubs({ query })

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
				style={{
					flex: 1,
					padding: 0,
					overflow: 'scroll',
				}}>
				<Header onBack={handleMoveToHomePage} />
				{categoryClubs?.length === 0 ? (
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<View style={{ marginBottom: 80, alignItems: 'center' }}>
							<Image
								source={require('../../assets/images/not-found.png')}
								style={{ width: 200, height: 200 }}
							/>
							<Text style={{ fontSize: 16, fontWeight: 'normal', color: Colors.FYI_BLACK }}>
								멍멍! (대충 검색결과가 없다는 뜻이에요)
							</Text>
						</View>
					</View>
				) : (
					<FlatList
						nestedScrollEnabled
						keyExtractor={(_, index) => index.toString()}
						data={categoryClubs}
						renderItem={({ item }) => (
							<TouchableOpacity onPress={() => openDetailPage(item)}>
								<ClubListItem club={item} />
							</TouchableOpacity>
						)}
						// Performance settings
						removeClippedSubviews={true} // Unmount components when outside of window
						initialNumToRender={6} // Reduce initial render amount
						maxToRenderPerBatch={1} // Reduce number in each render batch
						updateCellsBatchingPeriod={100} // Increase time between renders
						windowSize={7} // Reduce the window size
					/>
				)}
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
