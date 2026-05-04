import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { Category, CategoryMap } from '@/entities/category'
import { Club } from '@/entities/club'
import { SCREEN_TYPE, StackParamList } from '@/entities/screen'
import React, { useContext } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import Header from '@/features/club/components/ClubList/Header'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import ClubList from '@/features/club/components/ClubList/ClubList'
import { Colors } from '@/shared/constants/colors'

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.CLUB_LIST>
type DetailsScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.HOME>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const ClubListScreen = ({ route, navigation }: Props) => {
	const { name, category } = route.params as DetailsScreenRouteProp['params']
	const { data: clubs } = useCategoryClubs({ name, category })

	if (!category) return null
	const categoryDetail = CategoryMap[category]
	const headerTitle = `${categoryDetail.name} 동아리`

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

	return (
		<WithViewEventLog
			params={{
				screen_name: 'club_list_screen',
				category,
			}}>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={{ flex: 1, backgroundColor: Colors.WHITE, overflow: 'scroll' }}>
				<LinearGradient
					colors={['transparent', categoryDetail.backgroundColor]}
					style={StyleSheet.absoluteFillObject}
					pointerEvents="none"
				/>
				<Header title={headerTitle} onBack={handleMoveToHomePage} />
				<ClubList clubs={clubs} category={category} openDetailPage={openDetailPage} />
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

	return useQuery(
		['clubs', name ?? 'name', category ?? 'category'],
		() => clubService.listClubs({ name, category }),
		{
			select: data => data.clubs,
			staleTime: 60 * 1000,
			cacheTime: 5 * 60 * 1000,
		},
	)
}
