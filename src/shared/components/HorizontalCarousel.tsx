import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { Club } from '@/entities/club'
import ClubPreviewCard from '@/shared/components/ClubPreviewCard'
import useAutoScroll from '@/shared/hooks/useAutoScroll'
import { s } from '@/shared/utils/scale'

export const HORIZONTAL_CAROUSEL_BOTTOM_PADDING = s(2)

type Props = {
	clubs: Club[]
	onPressClub: (club: Club) => void
}

const HorizontalCarousel = ({ clubs, onPressClub }: Props) => {
	const { listRef, ...scrollEventProps } = useAutoScroll<Club>(clubs.length)

	return (
		<FlatList
			ref={listRef}
			{...scrollEventProps}
			horizontal
			showsHorizontalScrollIndicator={false}
			style={styles.list}
			contentContainerStyle={styles.contentContainer}
			scrollEventThrottle={16}
			data={clubs}
			keyExtractor={item => item.id}
			ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
			renderItem={({ item }) => (
				<ClubPreviewCard
					title={item.name}
					description={item.description ?? ''}
					imageSource={{ uri: item.imageUri }}
					onPress={() => onPressClub(item)}
				/>
			)}
		/>
	)
}

export default HorizontalCarousel

const styles = StyleSheet.create({
	list: {
		width: '100%',
		overflow: 'visible',
	},
	contentContainer: {
		paddingHorizontal: s(20),
		paddingBottom: HORIZONTAL_CAROUSEL_BOTTOM_PADDING,
	},
	itemSeparator: {
		width: 10,
	},
})
