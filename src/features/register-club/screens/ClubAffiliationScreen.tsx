import React, { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'
import TextField from '@/shared/components/TextField'
import { FormNavigationButtons } from '@/features/register-club/components/FormNavigationButtons'
import { RegisterClubFormData } from '@/features/register-club/types'

const DEPARTMENTS = [
	'중앙동아리',
	'인문대학',
	'국어국문학과',
	'중어중문학과',
	'영어영문학과',
	'공과대학',
	'컴퓨터공학과',
	'기계공학과',
]

type Props = {
	formData: RegisterClubFormData
	onFormDataChange: (data: Partial<RegisterClubFormData>) => void
	onNext: () => void
	onPrevious: () => void
}

export const ClubAffiliationScreen = ({ formData, onFormDataChange, onNext, onPrevious }: Props) => {
	const [showDropdown, setShowDropdown] = useState(false)
	const isComplete = formData.department.trim() && formData.shortIntro.trim()

	const handleSelectDepartment = (dept: string) => {
		onFormDataChange({ department: dept })
		setShowDropdown(false)
	}

	return (
		<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
			<ScrollView contentContainerStyle={styles.content}>
				<View style={styles.header}>
					<Text style={styles.title}>
						<Text style={styles.clubName}>{formData.clubName}</Text>
						<Text>의</Text>
						{'\n'}
						<Text>한줄소개를 완성해주세요</Text>
					</Text>
					<Text style={styles.helperText}>동아리 소개 최상단에 노출될 간단한 문구예요</Text>
				</View>

				<View style={styles.form}>
					{/* Department Dropdown */}
					<View style={styles.fieldWrapper}>
						<Pressable
							style={[styles.dropdown, showDropdown && styles.dropdownActive]}
							onPress={() => setShowDropdown(!showDropdown)}
						>
							<Text style={styles.dropdownText}>
								{formData.department || '단과대/학과'}
							</Text>
							<MaterialIcons
								name={showDropdown ? 'expand-less' : 'expand-more'}
								size={20}
								color={Colors.BODYTEXT_MAIN}
							/>
						</Pressable>

						{showDropdown && (
							<View style={styles.dropdownMenu}>
								{DEPARTMENTS.map((dept) => (
									<Pressable
										key={dept}
										style={[
											styles.dropdownItem,
											formData.department === dept && styles.dropdownItemSelected,
										]}
										onPress={() => handleSelectDepartment(dept)}
									>
										<Text
											style={[
												styles.dropdownItemText,
												formData.department === dept && styles.dropdownItemTextSelected,
											]}
										>
											{dept}
										</Text>
									</Pressable>
								))}
							</View>
						)}
						<Text style={styles.fieldLabel}>소속</Text>
					</View>

					{/* Short Introduction Input */}
					<View style={styles.fieldWrapper}>
						<TextField
							placeholder="동아리를 소개해 주세요"
							value={formData.shortIntro}
							onChangeText={(text) => onFormDataChange({ shortIntro: text })}
							maxLength={100}
						/>
						<Text style={styles.charCounter}>
							{formData.shortIntro.length} / 100
						</Text>
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
	dropdown: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: s(12),
		paddingVertical: vs(12),
		borderWidth: 1,
		borderColor: Colors.BODYTEXT_DISABLED,
		borderRadius: 4,
		backgroundColor: Colors.WHITE,
	},
	dropdownActive: {
		borderColor: Colors.BUTTON_SELECTED,
	},
	dropdownText: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_MAIN,
		flex: 1,
	},
	dropdownMenu: {
		borderWidth: 1,
		borderColor: Colors.BODYTEXT_DISABLED,
		borderRadius: 4,
		backgroundColor: Colors.WHITE,
		marginTop: vs(-8),
		paddingTop: vs(8),
	},
	dropdownItem: {
		paddingHorizontal: s(12),
		paddingVertical: vs(12),
		borderBottomWidth: 1,
		borderBottomColor: Colors.BACKGROUND_SUB,
	},
	dropdownItemSelected: {
		backgroundColor: Colors.BACKGROUND_SUB,
	},
	dropdownItemText: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_MAIN,
	},
	dropdownItemTextSelected: {
		color: Colors.BUTTON_SELECTED,
		fontWeight: '600',
	},
	fieldLabel: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_SUB,
	},
	charCounter: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_DISABLED,
		textAlign: 'right',
	},
})
