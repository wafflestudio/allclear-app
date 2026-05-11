import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
	closeBottomSheet: () => void
}

const ManageClubView = ({ closeBottomSheet }: Props) => {
	const [selectedOption, setSelectedOption] = useState<string>('')

	const options = [
		{ id: 'campus', label: '교내 동아리' },
		{ id: 'external', label: '교외 동아리' },
		{ id: 'existing', label: '이미 있는 동아리 운영진 등록' },
	]

	const isFormValid = selectedOption.length > 0

	const handleNext = () => {
		if (!isFormValid) return
		// TODO: API call to register club
		closeBottomSheet()
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>등록할 동아리의 유형을 선택해주세요</Text>

			{options.map(option => (
				<TouchableOpacity
					key={option.id}
					style={[
						styles.optionButton,
						selectedOption === option.id ? styles.optionButtonSelected : styles.optionButtonUnselected,
					]}
					onPress={() => setSelectedOption(option.id)}>
					<Text
						style={[
							styles.optionButtonText,
							selectedOption === option.id ? styles.optionButtonTextSelected : styles.optionButtonTextUnselected,
						]}>
						{option.label}
					</Text>
				</TouchableOpacity>
			))}

			<TouchableOpacity
				style={[styles.button, !isFormValid && styles.buttonDisabled]}
				onPress={handleNext}
				disabled={!isFormValid}>
				<Text style={[styles.buttonText, !isFormValid && styles.buttonTextDisabled]}>다음</Text>
			</TouchableOpacity>
		</View>
	)
}

export default ManageClubView

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingTop: 30,
		paddingBottom: 50,
		// Use explicit margins instead of `gap` for RN compatibility
	},
	title: {
		fontSize: 18,
		fontWeight: '600',
		color: '#181818',
		marginBottom: 20,
	},
	optionButton: {
		paddingHorizontal: 20,
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	optionButtonUnselected: {
		borderWidth: 1,
		borderColor: '#C1C1C1',
		backgroundColor: '#FFFFFF',
	},
	optionButtonSelected: {
		backgroundColor: '#EAEAEA',
		borderWidth: 0,
	},
	optionButtonText: {
		fontSize: 16,
		fontWeight: '500',
		textAlign: 'left',
		width: '100%',
	},
	optionButtonTextUnselected: {
		color: '#C1C1C1',
	},
	optionButtonTextSelected: {
		color: '#757474',
	},
	button: {
		paddingHorizontal: 50,
		paddingVertical: 12,
		minHeight: 48,
		borderRadius: 8,
		backgroundColor: '#874FFF',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 16,
		width: '100%',
	},
	buttonDisabled: {
		backgroundColor: '#EAEAEA',
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	buttonTextDisabled: {
		color: '#C1C1C1',
	},
})
