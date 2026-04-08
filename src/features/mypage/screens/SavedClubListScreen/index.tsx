import { useQuery } from '@tanstack/react-query'
import { Colors } from 'shared/constants/colors'
import { serviceContext } from 'shared/contexts/serviceContext'
import { Club } from 'entities/club'
import { SCREEN_TYPE } from 'entities/screen'
import WithViewEventLog from 'shared/hocs/WithViewEventLog'
import React, { useContext } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClubListItem from 'shared/components/ClubListItem'
import { navigation } from 'shared/utils/navigation'
import Header from './Header'

const SavedClubListScreen = () => {
	const { data: savedClubs } = useSavedClubs()

	const openDetailPage = (club: Club) => {
		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'search_result',
		})
	}

	const handleBack = () => {
		navigation.goBack()
	}

	return (
		<WithViewEventLog params={{ screen_name: 'saved_club_list_screen' }}>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={{
					flex: 1,
					padding: 0,
					overflow: 'scroll',
				}}>
				<Header onBack={handleBack} />
				{savedClubs?.length === 0 ? (
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<View style={{ marginBottom: 80, alignItems: 'center' }}>
							<Image
								source={require('../../assets/images/mypage/notfoundclub.png')}
								style={{ width: 148, height: 100 }}
							/>
							<Text style={{ fontSize: 14, fontWeight: 'normal', color: Colors.GRAY_40 }}>
								아직 저장한 동아리가 없어요
							</Text>
						</View>
					</View>
				) : (
					<FlatList
						nestedScrollEnabled
						keyExtractor={(_, index) => index.toString()}
						data={savedClubs}
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

export default SavedClubListScreen

const useSavedClubs = () => {
	const { clubService } = useContext(serviceContext)

	return useQuery(['savedClubs'], () => clubService.listSavedClubs(), {
		select: data => data.clubs,
	})
}
