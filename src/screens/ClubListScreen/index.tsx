import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { Colors } from 'constants/colors'
import { serviceContext } from 'contexts/serviceContext'
import { Category, CategoryMap } from 'entities/category'
import { Club } from 'entities/club'
import { SCREEN_TYPE, StackParamList } from 'entities/screen'
import React, { useContext } from 'react'
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClubListItem from 'screens/components/ClubListItem'
import Header from './Header'
import WithViewEventLog from 'hocs/WithViewEventLog'

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.CLUB_LIST>
type DetailsScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.HOME>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const ClubListScreen = ({ route, navigation }: Props) => {
	const deviceWidth = Dimensions.get('window').width

	const { name, category } = route.params as DetailsScreenRouteProp['params']
	const { data: categoryClubs } = useCategoryClubs({ name, category })

	const openDetailPage = (club: Club) => {
		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'club_list',
		})
	}

	const handleMoveToHomePage = () => {
		navigation.navigate(SCREEN_TYPE.HOME)
	}

	if (!category) return null

	const categoryDetail = CategoryMap[category]

	return (
		<WithViewEventLog
			params={{
				screen_name: 'club_list_screen',
				category,
			}}>
			<SafeAreaView
				key={`${categoryDetail.name}-top`}
				edges={['top']}
				style={{ flex: 0, backgroundColor: categoryDetail.safeArea }}
			/>
			<SafeAreaView
				key={`${categoryDetail.name}-horizontal`}
				edges={['left', 'right']}
				style={{
					flex: 1,
					padding: 0,
					overflow: 'scroll',
				}}>
				<View>
					<Image
						key={`${categoryDetail.name}-image`}
						source={categoryDetail.source}
						style={{
							width: '100%',
							height: deviceWidth * 0.8,
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							zIndex: -1,
						}}
					/>
				</View>
				<Header category={category} onBack={handleMoveToHomePage} />
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
								<ClubListItem club={item} category={category} />
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

export default ClubListScreen

type UseCategoryClubsProps = {
	name?: Club['name']
	category?: Category['name']
}

const useCategoryClubs = ({ name, category }: UseCategoryClubsProps) => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery(
		['clubs', name ?? 'name', category ?? 'category'],
		() => clubService.listClubs({ name, category }),
		{
			keepPreviousData: true,
			select: data => data.clubs,
		},
	)

	return query
}
