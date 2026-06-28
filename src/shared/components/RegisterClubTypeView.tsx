import React, { useState } from 'react'
import { StyleSheet, Text, Pressable, View } from 'react-native'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'
import { navigation } from '@/shared/utils/navigation'
import {
	RegisterClubKind,
	useRegisterClubTypeBottomSheet,
} from '@/shared/contexts/registerClubTypeBottomSheet'

// 교내/교외 preset the registration form's club type; 'existing' is routed to the
// existing-manager flow.
// TODO: route 'existing' (이미 있는 동아리 운영진 등록) to the manager-request flow.
const CLUB_TYPE_OPTIONS: { label: string; kind: RegisterClubKind }[] = [
	{ label: '교내 동아리', kind: '교내' },
	{ label: '교외 동아리', kind: '교외' },
	{ label: '이미 있는 동아리 운영진 등록', kind: 'existing' },
]

type Props = {
	closeBottomSheet: () => void
}

const RegisterClubTypeView = ({ closeBottomSheet }: Props) => {
	const { setSelectedKind } = useRegisterClubTypeBottomSheet()
	const [selected, setSelected] = useState<RegisterClubKind | null>(null)

	const handleNext = () => {
		if (!selected) {
			return
		}
		setSelectedKind(selected)
		closeBottomSheet()
		navigation.navigate('등록')
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>등록할 동아리의 유형을 선택해주세요</Text>

			<View style={styles.options}>
				{CLUB_TYPE_OPTIONS.map(option => {
					const isSelected = selected === option.kind
					return (
						<Pressable
							key={option.kind}
							style={[styles.option, isSelected && styles.optionSelected]}
							onPress={() => setSelected(option.kind)}>
							<Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
								{option.label}
							</Text>
						</Pressable>
					)
				})}
			</View>

			<Pressable
				style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
				onPress={handleNext}
				disabled={!selected}>
				<Text style={[styles.nextButtonText, !selected && styles.nextButtonTextDisabled]}>
					다음
				</Text>
			</Pressable>
		</View>
	)
}

export default RegisterClubTypeView

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: s(20),
		paddingTop: vs(8),
		paddingBottom: vs(24),
		backgroundColor: Colors.WHITE,
	},
	title: {
		...typography.headerL,
		color: Colors.BODYTEXT_MAIN,
		marginBottom: vs(24),
	},
	options: {
		gap: vs(12),
	},
	option: {
		paddingVertical: vs(16),
		paddingHorizontal: s(16),
		borderWidth: 1,
		borderColor: Colors.BODYTEXT_DISABLED,
		borderRadius: 8,
		backgroundColor: Colors.WHITE,
	},
	optionSelected: {
		backgroundColor: Colors.TEXTBOX_SELECTED,
		borderColor: Colors.TEXTBOX_SELECTED,
	},
	optionText: {
		...typography.bodyMRegular,
		color: Colors.BODYTEXT_DISABLED,
	},
	optionTextSelected: {
		color: Colors.BODYTEXT_MAIN,
	},
	nextButton: {
		marginTop: vs(20),
		paddingVertical: vs(16),
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.BUTTON_SELECTED,
	},
	nextButtonDisabled: {
		backgroundColor: Colors.TEXTBOX_SELECTED,
	},
	nextButtonText: {
		...typography.headerL,
		color: Colors.TEXT_BUTTON_SELECTED,
	},
	nextButtonTextDisabled: {
		color: Colors.BODYTEXT_DISABLED,
	},
})
