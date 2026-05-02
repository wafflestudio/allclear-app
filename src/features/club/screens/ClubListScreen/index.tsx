import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { Category, CategoryMap } from '@/entities/category'
import { Club } from '@/entities/club'
import { SCREEN_TYPE, StackParamList } from '@/entities/screen'
import React, { useContext } from 'react'
import { Dimensions, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import ClubListItem from '@/shared/components/ClubListItem'
import Header from '@/features/club/screens/ClubListScreen/Header'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.CLUB_LIST>
type DetailsScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.HOME>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const ClubListScreen = ({ route, navigation }: Props) => {
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
			<SafeAreaView edges={['top', 'left', 'right']} style={styles.horizontalSafeArea}>
				<LinearGradient
					colors={['transparent', categoryDetail.backgroundColor]}
					style={StyleSheet.absoluteFillObject}
					pointerEvents="none"
				/>
				<Header category={category} onBack={handleMoveToHomePage} />

				{categoryClubs?.length === 0 ? (
					<View style={styles.emptyState}>
						<View style={styles.emptyStateContent}>
							<Image
								source={require('@/assets/images/not-found.png')}
								style={styles.emptyStateImage}
							/>
							<Text style={styles.emptyStateText}>멍멍! (대충 검색결과가 없다는 뜻이에요)</Text>
						</View>
					</View>
				) : (
					<FlatList
						keyExtractor={item => item.id}
						data={categoryClubs}
						style={{ flex: 1, width: '100%' }}
						contentContainerStyle={{ gap: 25, paddingVertical: 8 }}
						renderItem={({ item }) => (
							<Pressable
								style={({ pressed }) => ({
									width: Dimensions.get('window').width,
									paddingHorizontal: 20,
									opacity: pressed ? 0.5 : 1,
								})}
								onPress={() => openDetailPage(item)}>
								<ClubListItem club={item} category={category} />
							</Pressable>
						)}
						removeClippedSubviews={true}
						initialNumToRender={6}
						maxToRenderPerBatch={1}
						updateCellsBatchingPeriod={100}
						windowSize={7}
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

const styles = StyleSheet.create({
	horizontalSafeArea: {
		flex: 1,
		padding: 0,
		backgroundColor: '#ffffff',
		overflow: 'scroll',
	},
	emptyState: {
		flex: 1,
		justifyContent: 'center',
	},
	emptyStateContent: {
		marginBottom: 80,
		alignItems: 'center',
	},
	emptyStateImage: {
		width: 200,
		height: 200,
	},
	emptyStateText: {
		fontSize: 16,
		fontWeight: 'normal',
	},
})
