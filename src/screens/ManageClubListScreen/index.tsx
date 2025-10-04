import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { ENV } from 'constants/ENV'
import { serviceContext } from 'contexts/serviceContext'
import 'dayjs/locale/ko'
import { Club } from 'entities/club'
import { SCREEN_TYPE, StackParamList } from 'entities/screen'
import React, { useContext } from 'react'
import { FlatList, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ClubListItem from 'screens/components/ClubListItem'
import { LOGIN_TOKEN } from 'utils/localStorage'
import Header from './Header'

type ScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.WEBVIEW>

type Props = {
	navigation: ScreenNavigationProp
}

const ManageClubListScreen = ({ navigation }: Props) => {
	const { data: manageClubs } = useManageClubs()

	const handleMoveToHomePage = () => navigation.goBack()

	const openManageClubDetailPage = async (club: Club) => {
		const authorization = await AsyncStorage.getItem(LOGIN_TOKEN)

		if (!authorization) return

		navigation.navigate(SCREEN_TYPE.WEBVIEW, {
			uri: ENV.WEB_URL + '/c/edit/' + club.uuid,
			authorization,
		})
	}

	return (
		<SafeAreaView
			edges={['top', 'left', 'right']}
			style={{
				flex: 1,
				padding: 0,
				overflow: 'scroll',
			}}>
			<Header onBack={handleMoveToHomePage} />
			<Text
				style={{
					marginHorizontal: 16,
					fontSize: 20,
					fontWeight: 'bold',
					padding: 10,
					marginBottom: 10,
				}}>
				동아리 정보 수정
			</Text>
			<FlatList
				nestedScrollEnabled
				keyExtractor={(_, index) => index.toString()}
				data={manageClubs}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => openManageClubDetailPage(item)}>
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
		</SafeAreaView>
	)
}

export default ManageClubListScreen

const useManageClubs = () => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery(['manageClubs'], () => clubService.listManageClubs(), {
		select: data => data.clubs,
	})

	return query
}
