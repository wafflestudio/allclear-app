import { useEffect, useMemo, useState } from 'react'
import { Category } from '@/entities/category'
import { Club } from '@/entities/club'
import { Image, StyleSheet, View, Text, useWindowDimensions } from 'react-native'
import { FlatList, Pressable } from 'react-native-gesture-handler'
import ClubCard from './ClubCard'
import ClubListSkeleton from './ClubListSkeleton'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'

type Props = {
	clubs: Club[] | undefined
	category?: Category['name']
	openDetailPage: (club: Club) => void
	emptyPlaceholder: string
	isLoading?: boolean
	pageSize?: number
}

const ClubList = ({
	clubs,
	category,
	openDetailPage,
	emptyPlaceholder,
	isLoading,
	pageSize,
}: Props) => {
	const { width } = useWindowDimensions()
	// 백엔드 페이지네이션 도입 전까지의 임시방편: 전체 결과를 받아 클라에서만 점진 렌더.
	// 서버 페이지네이션이 붙으면 visibleCount/slice를 걷어내고 useInfiniteQuery + onEndReached 콜백 구조로 교체.
	const [visibleCount, setVisibleCount] = useState(pageSize ?? Infinity)

	useEffect(() => {
		setVisibleCount(pageSize ?? Infinity)
	}, [clubs, pageSize])

	const visibleClubs = useMemo(() => {
		if (!clubs) return undefined
		if (pageSize === undefined) return clubs
		return clubs.slice(0, visibleCount)
	}, [clubs, pageSize, visibleCount])

	if (isLoading) return <ClubListSkeleton />
	if (!clubs || !visibleClubs) return null
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
			keyExtractor={item => item.id}
			data={visibleClubs}
			style={styles.list}
			contentContainerStyle={styles.listContent}
			renderItem={({ item }) => (
				<Pressable
					style={({ pressed }) => ({
						width,
						paddingHorizontal: s(20),
						opacity: pressed ? 0.5 : 1,
					})}
					onPress={() => openDetailPage(item)}>
					<ClubCard club={item} category={category} />
				</Pressable>
			)}
			onEndReached={
				pageSize === undefined
					? undefined
					: () => setVisibleCount(prev => Math.min(prev + pageSize, clubs.length))
			}
			onEndReachedThreshold={0.7}
			removeClippedSubviews={true}
			initialNumToRender={pageSize ?? 6}
			maxToRenderPerBatch={pageSize ?? 1}
			updateCellsBatchingPeriod={100}
			windowSize={7}
		/>
	)
}

const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
		paddingVertical: vs(8),
	},
})

export default ClubList
