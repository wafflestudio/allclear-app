import { BottomSheetTextInput } from '@gorhom/bottom-sheet'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import React, { useContext } from 'react'
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Toast from 'react-native-toast-message'

type Props = {
	closeBottomSheet: () => void
}

const ManageClubView = ({ closeBottomSheet }: Props) => {
	const [input, setInput] = React.useState('')
	const { clubService } = useContext(serviceContext)

	const handleSubmit = async () => {
		try {
			Keyboard.dismiss()
			closeBottomSheet()
			await clubService.requestClubManager({ clubName: input })

			setTimeout(() => {
				Toast.show({
					type: 'info',
					text1: '동아리 등록 요청이 전송되었어요!',
					position: 'bottom',
					visibilityTime: 2000,
				})
			}, 1000)

			setInput('')
		} catch (error) {
			Toast.show({
				type: 'info',
				text1: `이런! 문제가 생겼어요!`,
				position: 'bottom',
				visibilityTime: 2000,
			})
		}
	}

	return (
		<View style={styles.mainWrapper}>
			<View style={styles.titleWrapper}>
				<View>
					<Text style={[styles.title, styles.bold]}>
						올클에서 자신의 동아리를 직접 수정해보세요!
					</Text>
					<Text style={styles.title}>요청 후 등록까지는 최대 24시간이 소요됩니다</Text>
				</View>
			</View>
			<View>
				<View style={styles.inputWrapper}>
					<BottomSheetTextInput
						value={input}
						onChangeText={setInput}
						style={styles.input}
						maxLength={30}
						numberOfLines={2}
						multiline
						placeholder="동아리 이름을 입력해주세요"
					/>
				</View>
			</View>
			<View style={styles.buttonWrapper}>
				<TouchableOpacity
					disabled={!input.trim()}
					onPress={handleSubmit}
					style={[
						styles.button,
						{ backgroundColor: input.trim() ? '#3A3434' /* #deprecated color */ : '#C5BBB8' /* #deprecated color */ },
					]}>
					<Text
						style={{
							color: '#FFFFFF', // #deprecated color
							fontSize: 16,
							textAlign: 'center',
							fontWeight: 'bold',
						}}>
						요청하기
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default ManageClubView

const styles = StyleSheet.create({
	mainWrapper: {
		display: 'flex',
		paddingVertical: 32,
		paddingHorizontal: 24,
		backgroundColor: 'white',
	},

	titleWrapper: {
		display: 'flex',
		flex: 0,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 24,
	},

	title: {
		fontSize: 16,
		lineHeight: 24,
		textAlign: 'center',
	},

	bold: {
		fontWeight: 'bold',
	},

	inputWrapper: {},

	input: {
		height: '100%',
		maxHeight: 120,
		backgroundColor: '#FFFFFF', // #deprecated color
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 12,
		fontSize: 16,
		color: '#3A3434', // #deprecated color
		textAlignVertical: 'top',
	},

	buttonWrapper: {
		marginTop: 20,
		width: '100%',
	},

	button: {
		padding: 16,
		borderRadius: 12,
		marginBottom: 12,
	},
})
