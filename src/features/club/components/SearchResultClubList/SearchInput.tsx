import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

type Props = {
	query: string
	displayedCount: number
	totalCount: number
	onSubmit: (query: string) => void
}

const SearchInput = ({ query, displayedCount, totalCount, onSubmit }: Props) => {
	const [value, setValue] = useState(query)

	useEffect(() => {
		setValue(query)
	}, [query])

	const handleSubmit = () => {
		const nextQuery = value.trim()
		if (!nextQuery) return
		onSubmit(nextQuery)
	}

	return (
		<View style={styles.container}>
			<Icon name="magnify" size={ms(20)} color={Colors.POINTCOLOR} />
			<TextInput
				value={value}
				onChangeText={setValue}
				onSubmitEditing={handleSubmit}
				returnKeyType="search"
				style={styles.input}
				placeholder="검색어를 입력하세요"
				placeholderTextColor={Colors.BODYTEXT_DISABLED}
			/>
			<Text style={styles.count}>
				<Text style={styles.visibleCount}>{displayedCount}</Text>
				<Text style={styles.totalCount}>/{totalCount}</Text>
			</Text>
			<Pressable onPress={() => setValue('')} hitSlop={8} style={styles.clearButton}>
				<Icon name="close-circle" size={ms(14)} color={Colors.BODYTEXT_DISABLED} />
			</Pressable>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		minHeight: vs(49),
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(12),
		paddingHorizontal: s(17),
		paddingVertical: vs(13),
		borderRadius: ms(8),
		backgroundColor: Colors.BACKGROUND_SUB,
	},
	input: {
		...typography.bodyMMedium,
		flex: 1,
		minWidth: 0,
		padding: 0,
		color: Colors.BODYTEXT_MAIN,
	},
	count: {
		...typography.bodyMMedium,
	},
	visibleCount: {
		color: Colors.BODYTEXT_SUB,
	},
	totalCount: {
		color: '#CBCBCB',
	},
	clearButton: {
		width: ms(16),
		height: ms(16),
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default SearchInput
