import { useQuery } from '@tanstack/react-query'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { Club } from '@/entities/club'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useContext, useRef } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import ClubPreviewCard from '@/shared/components/ClubPreviewCard'
import { s } from '@/shared/utils/scale'

const AUTO_SCROLL_INTERVAL_MS = 16
const AUTO_SCROLL_STEP = 0.5

type Props = {
	openDetailPage: (club: Club) => void
}

const LatestClubsSection = ({ openDetailPage }: Props) => {
	const { data: latestClubs } = useLatestClubs()
	const latestClubCount = latestClubs?.length ?? 0
	const listRef = useRef<FlatList<Club>>(null)
	const scrollOffsetRef = useRef(0)
	const contentWidthRef = useRef(0)
	const listWidthRef = useRef(0)
	const maxScrollOffsetRef = useRef(0)
	const isUserInteractingRef = useRef(false)
	const isAutoScrollFinishedRef = useRef(false)

	const updateMaxScrollOffset = () => {
		maxScrollOffsetRef.current = Math.max(contentWidthRef.current - listWidthRef.current, 0)
	}

	const pauseAutoScroll = () => {
		isUserInteractingRef.current = true
	}

	const resumeAutoScroll = () => {
		isUserInteractingRef.current = false
	}

	const handleLayout = (event: LayoutChangeEvent) => {
		listWidthRef.current = event.nativeEvent.layout.width
		updateMaxScrollOffset()
	}

	const handleContentSizeChange = (contentWidth: number) => {
		contentWidthRef.current = contentWidth
		isAutoScrollFinishedRef.current = false
		updateMaxScrollOffset()
	}

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const currentOffset = event.nativeEvent.contentOffset.x

		scrollOffsetRef.current = currentOffset
		isAutoScrollFinishedRef.current = currentOffset >= maxScrollOffsetRef.current
	}

	useFocusEffect(
		useCallback(() => {
			if (latestClubCount <= 1) {
				return
			}

			scrollOffsetRef.current = 0
			isAutoScrollFinishedRef.current = false
			listRef.current?.scrollToOffset({ offset: 0, animated: false })

			const intervalId = setInterval(() => {
				if (
					isUserInteractingRef.current ||
					isAutoScrollFinishedRef.current ||
					maxScrollOffsetRef.current <= 0
				) {
					return
				}

				const nextOffset = Math.min(
					scrollOffsetRef.current + AUTO_SCROLL_STEP,
					maxScrollOffsetRef.current,
				)

				scrollOffsetRef.current = nextOffset
				isAutoScrollFinishedRef.current = nextOffset >= maxScrollOffsetRef.current
				listRef.current?.scrollToOffset({ offset: nextOffset, animated: false })
			}, AUTO_SCROLL_INTERVAL_MS)

			return () => clearInterval(intervalId)
		}, [latestClubCount]),
	)

	return (
		<FlatList
			ref={listRef}
			horizontal
			showsHorizontalScrollIndicator={false}
			style={styles.list}
			contentContainerStyle={styles.listContentContainer}
			scrollEventThrottle={16}
			keyExtractor={item => item.id}
			data={latestClubs ?? []}
			ItemSeparatorComponent={ItemSeparator}
			onLayout={handleLayout}
			onContentSizeChange={handleContentSizeChange}
			onScroll={handleScroll}
			onTouchStart={pauseAutoScroll}
			onTouchEnd={resumeAutoScroll}
			onTouchCancel={resumeAutoScroll}
			onScrollBeginDrag={pauseAutoScroll}
			onMomentumScrollBegin={pauseAutoScroll}
			onMomentumScrollEnd={resumeAutoScroll}
			renderItem={({ item }) => (
				<ClubPreviewCard
					title={item.name}
					description={item.description}
					imageSource={{ uri: item.imageUri }}
					onPress={() => openDetailPage(item)}
				/>
			)}
		/>
	)
}

export default LatestClubsSection

const ItemSeparator = () => <View style={styles.itemSeparator} />

const useLatestClubs = () => {
	const { clubService } = useContext(serviceContext)

	const query = useQuery({
		queryKey: ['clubs', 'latest'],
		queryFn: () => clubService.listLatestClubs(),
		keepPreviousData: true,
		select: data => data.clubs,
	})

	return query
}

const styles = StyleSheet.create({
	list: {
		width: '100%',
		overflow: 'visible',
	},
	listContentContainer: {
		paddingHorizontal: s(20),
		paddingBottom: s(2),
	},
	itemSeparator: {
		width: 10,
	},
})
