import { useState } from 'react'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'

import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'

type Props = {
	value?: string
	onChangeText?: (text: string) => void
	onSubmit?: (query: string) => void
	placeholder?: string
}

const DEFAULT_PLACEHOLDER = '동아리의 키워드 혹은 소속 학과로 검색해보세요'
const MAX_LENGTH = 10

const SearchInput = ({
	value: controlledValue,
	onChangeText,
	onSubmit,
	placeholder = DEFAULT_PLACEHOLDER,
}: Props) => {
	const [internalValue, setInternalValue] = useState('')
	const isControlled = controlledValue !== undefined
	const value = isControlled ? controlledValue : internalValue

	const handleChangeText = (text: string) => {
		if (!isControlled) setInternalValue(text)
		onChangeText?.(text)
	}

	const handleSubmit = () => {
		const trimmed = value.trim()
		if (trimmed.length === 0) return
		onSubmit?.(trimmed)
		if (!isControlled) setInternalValue('') // initialize searchPage's searchBar
	}

	return (
		<View style={styles.container}>
			<Image source={require('@/assets/icons/search-icon.png')} style={styles.icon} />
			<TextInput
				style={styles.input}
				value={value}
				onChangeText={handleChangeText}
				placeholder={placeholder}
				placeholderTextColor={Colors.BODYTEXT_DISABLED}
				onSubmitEditing={handleSubmit}
				returnKeyType="search"
				maxLength={MAX_LENGTH}
			/>
			{value.length > 0 && (
				<Text>
					<Text style={styles.counterCurrent}>{value.length}</Text>
					<Text style={styles.counterMax}>/{MAX_LENGTH}</Text>
				</Text>
			)}
		</View>
	)
}

export default SearchInput

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(15),
		paddingVertical: vs(16),
		paddingHorizontal: s(20),
		backgroundColor: Colors.BACKGROUND_SUB,
		borderRadius: s(10),
	},
	icon: {
		width: s(15),
		height: s(15),
		resizeMode: 'contain',
	},
	input: {
		flex: 1,
		...typography.bodyMMedium,
		color: Colors.BODYTEXT_MAIN,
		padding: 0,
	},
	counterCurrent: {
		...typography.bodyMMedium,
		color: Colors.BODYTEXT_SUB,
	},
	counterMax: {
		...typography.bodyMMedium,
		color: Colors.BODYTEXT_DISABLED,
	},
})
