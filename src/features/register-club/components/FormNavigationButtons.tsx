import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from '@/shared/components/Button'
import { s, vs } from '@/shared/utils/scale'

type Props = {
	onPrevious?: () => void
	onNext?: () => void
	nextLabel?: string
	previousLabel?: string
	isLastStep?: boolean
	isNextDisabled?: boolean
}

export const FormNavigationButtons = ({
	onPrevious,
	onNext,
	nextLabel = '다음',
	previousLabel = '이전',
	isLastStep = false,
	isNextDisabled = false,
}: Props) => {
	return (
		<View style={styles.container}>
			<Button
				label={previousLabel}
				onPress={onPrevious || (() => {})}
				variant="outline"
				style={styles.button}
			/>
			<Button
				label={isLastStep ? '완료' : nextLabel}
				onPress={onNext || (() => {})}
				disabled={isNextDisabled}
				style={styles.button}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		gap: s(12),
		paddingHorizontal: s(16),
		paddingVertical: vs(16),
	},
	button: {
		flex: 1,
	},
})
