import { useQuery } from '@tanstack/react-query'
import { serviceContext } from 'contexts/serviceContext'
import { useContext } from 'react'
import { Dimensions, FlatList, View } from 'react-native'
import CategoryCard from './CategoryCard'
import { Category } from 'entities/category'
import { initialCategories } from 'constants/fixtures'

const CategoryBoard = () => {
	const { data: categories } = useCategories()
	const deviceWidth = Dimensions.get('window').width - 48
	const chunkedCategories = chunkCategories(categories)

	if (!chunkedCategories) return null

	return (
		<View style={{ marginVertical: 16, width: deviceWidth, alignSelf: 'center' }}>
			{chunkedCategories.map((chunk, index) => (
				<FlatList
					key={index}
					keyExtractor={(_, chunkIdx) => chunkIdx.toString()}
					data={chunk.categories}
					renderItem={({ item }) => <CategoryCard category={item} />}
					numColumns={chunk.len}
					scrollEnabled={false}
				/>
			))}
		</View>
	)
}

export default CategoryBoard

const useCategories = () => {
	const { categoryService } = useContext(serviceContext)

	const query = useQuery({
		queryKey: ['categories'],
		queryFn: () => categoryService.listCategories(),
		keepPreviousData: true,
		select: data => data.categories,
		initialData: { categories: initialCategories, totalSize: initialCategories.length },
	})

	return query
}

const chunkCategories = (categories?: Category[]) => {
	if (!categories) return []

	const n = categories.length
	const q = Math.floor(n / 3)
	const r = n % 3
	const arr = Array(q).fill(3)

	if (r === 1) {
		arr.push(2, 1)
	} else if (r === 2) {
		arr.push(1, 1)
	}

	for (let i = 1; i < arr.length; i++) {
		if (arr[i] === arr[i - 1]) {
			if (arr[i] === 3) {
				arr[i] = 2
				arr.push(1)
			} else if (arr[i] === 2) {
				arr[i] = 1
				arr[i - 1] = 2
			}
		}
	}

	let index = 0
	const result = arr.map(len => {
		const subArray = categories.slice(index, index + len)
		index += len
		return { len, categories: subArray }
	})

	return result
}
