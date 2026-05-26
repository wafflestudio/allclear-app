import React from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'
import TextField from '@/shared/components/TextField'
import { FormNavigationButtons } from '@/features/register-club/components/FormNavigationButtons'
import { RegisterClubFormData } from '@/features/register-club/types'
import Icon from 'react-native-vector-icons/MaterialIcons'

type Props = {
	formData: RegisterClubFormData
	onFormDataChange: (data: Partial<RegisterClubFormData>) => void
	onNext: () => void
	onPrevious: () => void
}

export const ClubBasicInfoScreen = ({ formData, onFormDataChange, onNext, onPrevious }: Props) => {
	const isComplete = formData.clubName.trim()

	const handleAddImage = () => {
		// TODO: Implement image picker
		// For now, we'll use a placeholder
		// You can integrate react-native-image-picker or similar library
	}

	return (
		<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>
						<Text>신규 등록할</Text>
						{'\n'}
						<Text>동아리 기본 정보를 입력해주세요</Text>
					</Text>
				</View>

				<View style={styles.form}>
					<View style={styles.fieldWrapper}>
						<Text style={styles.label}>동아리 대표 이미지</Text>
						<Text style={styles.helperText}>4X4 정방형 이미지를 권장드려요</Text>
						<Pressable
							style={styles.imageUploadBox}
							onPress={handleAddImage}
						>
							{formData.clubImage ? (
								<Image
									source={{ uri: formData.clubImage }}
									style={styles.uploadedImage}
								/>
							) : (
								<View style={styles.placeholderContent}>
									<Icon
										name="add-photo-alternate"
										size={s(40)}
										color={Colors.BODYTEXT_DISABLED}
									/>
								</View>
							)}
						</Pressable>
						<Pressable style={styles.imageButton}>
							<Text style={styles.imageButtonText}>이미지 변경</Text>
						</Pressable>
						<Text style={styles.errorText}>대표 이미지를 등록해주세요</Text>
					</View>

					<View style={styles.fieldWrapper}>
						<Text style={styles.label}>동아리명</Text>
						<TextField
							placeholder="와플스튜디오"
							value={formData.clubName}
							onChangeText={(text) => onFormDataChange({ clubName: text })}
							maxLength={100}
						/>
						<Text style={styles.helperText}>동아리명을 입력해주세요</Text>
					</View>
				</View>
			</ScrollView>

			<FormNavigationButtons
				onPrevious={onPrevious}
				onNext={onNext}
				isNextDisabled={!isComplete}
			/>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.WHITE,
	},
	content: {
		padding: s(20),
		paddingBottom: vs(20),
	},
	header: {
		marginBottom: vs(32),
	},
	title: {
		...typography.headerXXL,
		color: Colors.BODYTEXT_MAIN,
	},
	form: {
		gap: vs(24),
	},
	fieldWrapper: {
		gap: vs(4),
	},
	label: {
		...typography.bodySMedium,
		color: Colors.BODYTEXT_MAIN,
	},
	helperText: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_DISABLED,
	},
	errorText: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_DISABLED,
	},
	imageUploadBox: {
		borderWidth: 1,
		borderColor: Colors.BODYTEXT_DISABLED,
		borderStyle: 'dashed',
		borderRadius: s(8),
		height: vs(150),
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: Colors.BACKGROUND_SUB,
		marginVertical: vs(8),
	},
	placeholderContent: {
		alignItems: 'center',
		gap: vs(8),
	},
	uploadedImage: {
		width: '100%',
		height: '100%',
		borderRadius: s(6),
	},
	imageButton: {
		paddingVertical: vs(10),
		paddingHorizontal: s(24),
		backgroundColor: Colors.BUTTON_SELECTED,
		borderRadius: s(8),
		alignItems: 'center',
		marginVertical: vs(8),
	},
	imageButtonText: {
		...typography.bodySMedium,
		color: Colors.TEXT_BUTTON_SELECTED,
	},
})
