import { Category } from '@/entities/category'
import { Club } from '@/entities/club'
import { Image, StyleSheet, View, Text, useWindowDimensions } from 'react-native'
import { FlatList, Pressable } from 'react-native-gesture-handler'
import ClubCard from './ClubCard'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'

type Props = {
	clubs: Club[] | undefined
	category?: Category['name']
	openDetailPage: (club: Club) => void
}

const ClubList = ({ clubs, category, openDetailPage }: Props) => {
	const { width } = useWindowDimensions()

	if (!clubs) return null
	if (clubs.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Image source={require('@/assets/images/not-found.png')} />
				<Text style={styles.emptyText}>
					앗 검색 결과가 없어요!{'\n'} 다른 키워드로 검색해주세요
				</Text>
			</View>
		)
	}

	return (
		<FlatList
			keyExtractor={item => item.id}
			data={clubs}
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
			removeClippedSubviews={true}
			initialNumToRender={6}
			maxToRenderPerBatch={1}
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
	emptyText: {
		...typography.bodySRegular,
		textAlign: 'center',
		marginTop: vs(20),
		color: Colors.BODYTEXT_SUB,
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
