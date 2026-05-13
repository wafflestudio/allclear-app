import React, { useEffect, useMemo, useState } from 'react'
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Club } from '@/entities/club'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'
import ClubListItem from './ClubListItem'

const PAGE_SIZE = 5

type Props = {
	clubs: Club[] | undefined
	savedClubIds: Set<Club['uuid']>
	onPressClub: (club: Club) => void
	onToggleSaved: (club: Club) => void
	onDisplayedCountChange: (count: number) => void
	emptyPlaceholder: string
}

const SearchResultList = ({
	clubs,
	savedClubIds,
	onPressClub,
	onToggleSaved,
	onDisplayedCountChange,
	emptyPlaceholder,
}: Props) => {
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

	useEffect(() => {
		setVisibleCount(PAGE_SIZE)
	}, [clubs])

	const visibleClubs = useMemo(() => {
		return clubs?.slice(0, visibleCount) ?? []
	}, [clubs, visibleCount])

	useEffect(() => {
		onDisplayedCountChange(visibleClubs.length)
	}, [onDisplayedCountChange, visibleClubs.length])

	if (!clubs) return null

	if (clubs.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Image source={require('@/assets/images/not-found.png')} style={styles.emptyImage} />
				<Text style={styles.emptyText}>{emptyPlaceholder}</Text>
			</View>
		)
	}

	return (
		<FlatList
			keyExtractor={item => item.uuid}
			data={visibleClubs}
			style={styles.list}
			contentContainerStyle={styles.listContent}
			renderItem={({ item }) => (
				<Pressable
					style={({ pressed }) => [styles.itemPressable, pressed && styles.itemPressed]}
					onPress={() => onPressClub(item)}>
					<ClubListItem
						club={item}
						isSaved={savedClubIds.has(item.uuid)}
						onToggleSaved={() => onToggleSaved(item)}
					/>
				</Pressable>
			)}
			onEndReached={() => setVisibleCount(prev => Math.min(prev + PAGE_SIZE, clubs.length))}
			onEndReachedThreshold={0.7}
			removeClippedSubviews={true}
			initialNumToRender={PAGE_SIZE}
			maxToRenderPerBatch={PAGE_SIZE}
			windowSize={7}
		/>
	)
}

const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: vs(80),
	},
	emptyImage: {
		width: s(122),
		height: s(99),
	},
	emptyText: {
		...typography.bodySRegular,
		textAlign: 'center',
		marginTop: vs(20),
		color: Colors.BODYTEXT_MAIN,
	},
	list: {
		flex: 1,
		width: '100%',
	},
	listContent: {
		gap: vs(25),
		paddingHorizontal: s(20),
		paddingTop: vs(10),
		paddingBottom: vs(44),
	},
	itemPressable: {
		width: '100%',
	},
	itemPressed: {
		opacity: 0.6,
	},
})

export default SearchResultList
