import { Category } from '@/entities/category'
import { Club } from '@/entities/club'
import { Image, Dimensions, View, Text } from 'react-native'
import { FlatList, Pressable } from 'react-native-gesture-handler'
import ClubCard from './ClubCard'
import { Colors } from '@/shared/constants/colors'

type Props = {
	clubs: Club[] | undefined
	category?: Category['name']
	openDetailPage: (club: Club) => void
}

const ClubList = ({ clubs, category, openDetailPage }: Props) => {
	if (!clubs) return null
	if (clubs.length === 0) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Image source={require('@/assets/images/not-found.png')} />
				<Text
					style={{
						textAlign: 'center',
						fontSize: 12,
						marginTop: 20,
						color: Colors.BODYTEXT_SUB,
					}}>
					앗 검색 결과가 없어요!{'\n'} 다른 키워드로 검색해주세요
				</Text>
			</View>
		)
	}

	return (
		<FlatList
			keyExtractor={item => item.id}
			data={clubs}
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

export default ClubList
