import { useQuery } from '@tanstack/react-query'
import { serviceContext } from 'contexts/serviceContext'
import { Club } from 'entities/club'
import useExposeEventLog from 'hooks/useExposeEventLog'
import React, { useContext, useRef } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native'
import RecommendClubCard from './RecommendClubCard'

type Props = {
	openDetailPage: (club: Club) => void
}

const RecommendClubs = ({ openDetailPage }: Props) => {
	const { data: latestClubs } = useLatestClubs()
	const { logExposeEvent } = useExposeEventLog()

	const viewabilityConfig = { itemVisiblePercentThreshold: 50 }
	const onViewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
		const lastItem = viewableItems[viewableItems.length - 1]
		logExposeEvent({
			screen_name: 'home_screen',
			expose_type: 'swipe',
			card_index: `${lastItem.index ?? 0 + 1}`,
		})
	}
	const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				<View style={styles.titleWrapper}>
					<Text style={styles.title}>새로운 공고가 올라왔어요</Text>
				</View>
			</View>
			<FlatList
				viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
				horizontal
				keyExtractor={(_, index) => index.toString()}
				data={latestClubs}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => openDetailPage(item)}>
						<RecommendClubCard club={item} />
					</TouchableOpacity>
				)}
				// Performance settings
				removeClippedSubviews={true} // Unmount components when outside of window
				initialNumToRender={3} // Reduce initial render amount
				maxToRenderPerBatch={1} // Reduce number in each render batch
				updateCellsBatchingPeriod={100} // Increase time between renders
				windowSize={7} // Reduce the window size
			/>
		</View>
	)
}

export default RecommendClubs

const styles = StyleSheet.create({
	container: {
		padding: 12,
	},
	headerRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 12,
	},
	titleWrapper: {
		marginBottom: 12,
	},
	title: {
		fontSize: 16,
		fontWeight: 'bold',
	},
})

const useLatestClubs = () => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery(['clubs', 'latest'], () => clubService.listLatestClubs(), {
		keepPreviousData: true,
		select: data => data.clubs,
	})

	return query
}
