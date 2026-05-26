import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'
import TextField from '@/shared/components/TextField'
import { FormNavigationButtons } from '@/features/register-club/components/FormNavigationButtons'
import { RegisterClubFormData } from '@/features/register-club/types'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const RECRUIT_TYPES = ['정기', '상시', '미정']

type Props = {
	formData: RegisterClubFormData
	onFormDataChange: (data: Partial<RegisterClubFormData>) => void
	onComplete: () => void
	onPrevious: () => void
}

export const ClubDetailsScreen = ({ formData, onFormDataChange, onComplete, onPrevious }: Props) => {
	const [activityCycleMode, setActivityCycleMode] = useState<'none' | 'number'>(
		formData.activityCycle ? 'number' : 'none'
	)

	const toggleDongbang = () => {
		onFormDataChange({ hasDongbang: !formData.hasDongbang })
	}

	const handleActivityCycleModeChange = (mode: 'none' | 'number') => {
		setActivityCycleMode(mode)
		if (mode === 'none') {
			onFormDataChange({ activityCycle: '' })
		}
	}

	const handleActivityCycleChange = (value: string) => {
		// Only allow numbers
		const numValue = value.replace(/[^0-9]/g, '')
		onFormDataChange({ activityCycle: numValue })
	}

	const incrementActivityCycle = () => {
		const current = parseInt(formData.activityCycle, 10) || 0
		onFormDataChange({ activityCycle: (current + 1).toString() })
	}

	const decrementActivityCycle = () => {
		const current = parseInt(formData.activityCycle, 10) || 0
		if (current > 0) {
			onFormDataChange({ activityCycle: (current - 1).toString() })
		}
	}

	const isComplete =
		formData.recruitType.trim() &&
		formData.clubSNS.trim() &&
		formData.clubDescription.trim() &&
		(activityCycleMode === 'none' || formData.activityCycle.trim())

	return (
		<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>
						<Text style={styles.clubName}>{formData.clubName}</Text>
						<Text>의</Text>
						{'\n'}
						<Text>세부정보를 입력해주세요</Text>
					</Text>
					<Text style={styles.helperText}>동아리에 대해 자세히 소개해주세요</Text>
				</View>

				<View style={styles.form}>
					{/* Recruitment Type - Button Group */}
					<View style={styles.fieldWrapper}>
						<Text style={styles.fieldLabel}>모집 형태</Text>
						<View style={styles.buttonGroup}>
							{RECRUIT_TYPES.map((type) => (
								<Pressable
									key={type}
									style={[
										styles.typeButton,
										formData.recruitType === type && styles.typeButtonSelected,
									]}
									onPress={() => onFormDataChange({ recruitType: type })}
								>
									<Text
										style={[
											styles.typeButtonText,
											formData.recruitType === type && styles.typeButtonTextSelected,
										]}
									>
										{type}
									</Text>
								</Pressable>
							))}
						</View>
					</View>

					{/* Activity Cycle */}
					<View style={styles.fieldWrapper}>
						<Text style={styles.fieldLabel}>최소 활동 기간</Text>
						<View style={styles.activityCycleContainer}>
							<Pressable
								style={[
									styles.modeButton,
									activityCycleMode === 'none' && styles.modeButtonSelected,
								]}
								onPress={() => handleActivityCycleModeChange('none')}
							>
								<Text
									style={[
										styles.modeButtonText,
										activityCycleMode === 'none' && styles.modeButtonTextSelected,
									]}
								>
									없음
								</Text>
							</Pressable>
							<Pressable
								style={[
									styles.modeButton,
									activityCycleMode === 'number' && styles.modeButtonSelected,
								]}
								onPress={() => handleActivityCycleModeChange('number')}
							>
								<Text
									style={[
										styles.modeButtonText,
										activityCycleMode === 'number' && styles.modeButtonTextSelected,
									]}
								>
									있음
								</Text>
							</Pressable>
						</View>

						{activityCycleMode === 'number' && (
							<View style={styles.stepperContainer}>
								<Pressable
									style={styles.stepperButton}
									onPress={decrementActivityCycle}
								>
									<MaterialIcons name="remove" size={20} color={Colors.BUTTON_SELECTED} />
								</Pressable>
								<TextInput
									style={styles.stepperInput}
									value={formData.activityCycle}
									onChangeText={handleActivityCycleChange}
									placeholder="0"
									keyboardType="number-pad"
									maxLength={3}
									textAlign="center"
								/>
								<Pressable
									style={styles.stepperButton}
									onPress={incrementActivityCycle}
								>
									<MaterialIcons name="add" size={20} color={Colors.BUTTON_SELECTED} />
								</Pressable>
								<Text style={styles.stepperLabel}>개월</Text>
							</View>
						)}
					</View>

					{/* Dongbang */}
					<View style={styles.fieldWrapper}>
						<Text style={styles.fieldLabel}>동방 보유 여부</Text>
						<Pressable
							style={[
								styles.dongbangButton,
								formData.hasDongbang && styles.dongbangButtonSelected,
							]}
							onPress={toggleDongbang}
						>
							<MaterialIcons
								name={formData.hasDongbang ? 'check-box' : 'check-box-outline-blank'}
								size={24}
								color={formData.hasDongbang ? Colors.BUTTON_SELECTED : Colors.BODYTEXT_DISABLED}
							/>
							<Text
								style={[
									styles.dongbangText,
									formData.hasDongbang && styles.dongbangTextSelected,
								]}
							>
								동방 있음
							</Text>
						</Pressable>
					</View>

					{/* SNS */}
					<View style={styles.fieldWrapper}>
						<Text style={styles.fieldLabel}>동아리 SNS</Text>
						<TextField
							placeholder="@instagram_handle 또는 https://..."
							value={formData.clubSNS}
							onChangeText={(text) => onFormDataChange({ clubSNS: text })}
							maxLength={200}
						/>
					</View>

					{/* Description */}
					<View style={styles.fieldWrapper}>
						<Text style={styles.fieldLabel}>동아리 추가 설명</Text>
						<TextField
							placeholder="동아리에 대해 자유롭게 설명해주세요"
							value={formData.clubDescription}
							onChangeText={(text) => onFormDataChange({ clubDescription: text })}
							maxLength={500}
							multiline
							numberOfLines={6}
							textAlignVertical="top"
						/>
						<Text style={styles.charCounter}>
							{formData.clubDescription.length} / 500
						</Text>
					</View>
				</View>
			</ScrollView>

			<FormNavigationButtons
				onPrevious={onPrevious}
				onNext={onComplete}
				nextLabel="완료"
				isLastStep
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
		marginBottom: vs(8),
	},
	clubName: {
		color: Colors.BUTTON_SELECTED,
		fontWeight: '800',
	},
	helperText: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_DISABLED,
	},
	form: {
		gap: vs(24),
	},
	fieldWrapper: {
		gap: vs(8),
	},
	fieldLabel: {
		...typography.bodySMedium,
		color: Colors.BODYTEXT_MAIN,
	},
	buttonGroup: {
		flexDirection: 'row',
		gap: s(8),
	},
	typeButton: {
		flex: 1,
		paddingVertical: vs(12),
		paddingHorizontal: s(12),
		borderRadius: 4,
		borderWidth: 1,
		borderColor: Colors.BODYTEXT_DISABLED,
		backgroundColor: Colors.WHITE,
		alignItems: 'center',
	},
	typeButtonSelected: {
		backgroundColor: Colors.BUTTON_SELECTED,
		borderColor: Colors.BUTTON_SELECTED,
	},
	typeButtonText: {
		...typography.bodySMedium,
		color: Colors.BODYTEXT_MAIN,
	},
	typeButtonTextSelected: {
		color: Colors.WHITE,
		fontWeight: '600',
	},
	activityCycleContainer: {
		gap: vs(12),
	},
	modeButton: {
		flex: 1,
		paddingVertical: vs(12),
		paddingHorizontal: s(12),
		borderRadius: 4,
		borderWidth: 1,
		borderColor: Colors.BODYTEXT_DISABLED,
		backgroundColor: Colors.WHITE,
		alignItems: 'center',
	},
	modeButtonSelected: {
		backgroundColor: Colors.BUTTON_SELECTED,
		borderColor: Colors.BUTTON_SELECTED,
	},
	modeButtonText: {
		...typography.bodySMedium,
		color: Colors.BODYTEXT_MAIN,
	},
	modeButtonTextSelected: {
		color: Colors.WHITE,
		fontWeight: '600',
	},
	stepperContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(8),
		paddingHorizontal: s(12),
		paddingVertical: vs(12),
		borderWidth: 1,
		borderColor: Colors.BODYTEXT_DISABLED,
		borderRadius: 4,
		backgroundColor: Colors.BACKGROUND_SUB,
	},
	stepperButton: {
		width: s(40),
		height: vs(40),
		borderRadius: 4,
		backgroundColor: Colors.WHITE,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: Colors.BUTTON_SELECTED,
	},
	stepperInput: {
		flex: 1,
		...typography.bodySMedium,
		color: Colors.BODYTEXT_MAIN,
		textAlign: 'center',
		paddingVertical: vs(8),
		paddingHorizontal: s(8),
	},
	stepperLabel: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_SUB,
	},
	dongbangButton: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(12),
		paddingVertical: vs(12),
		paddingHorizontal: s(16),
		borderRadius: 4,
		borderWidth: 1,
		borderColor: Colors.BODYTEXT_DISABLED,
		backgroundColor: Colors.WHITE,
	},
	dongbangButtonSelected: {
		borderColor: Colors.BUTTON_SELECTED,
		backgroundColor: Colors.BACKGROUND_SUB,
	},
	dongbangText: {
		...typography.bodySMedium,
		color: Colors.BODYTEXT_MAIN,
	},
	dongbangTextSelected: {
		color: Colors.BUTTON_SELECTED,
		fontWeight: '600',
	},
	charCounter: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_DISABLED,
		textAlign: 'right',
	},
})
