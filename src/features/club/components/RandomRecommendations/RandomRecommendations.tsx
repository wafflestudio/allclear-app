import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { Club } from '@/entities/club'
import HorizontalCarousel from '@/shared/components/HorizontalCarousel'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'

type Props = {
	clubs: Club[]
	onPressClub: (club: Club) => void
}

const RandomRecommendations = ({ clubs, onPressClub }: Props) => {
	if (clubs.length === 0) {
		return null
	}

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>이런 동아리는 어때요?</Text>
				<Text style={styles.subtitle}>다양한 동아리를 추천해드려요</Text>
			</View>
			<HorizontalCarousel clubs={clubs} onPressClub={onPressClub} />
		</View>
	)
}

export default RandomRecommendations

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.BACKGROUND_SUB,
		paddingTop: vs(24),
		paddingBottom: vs(30),
		gap: vs(16),
	},
	header: {
		paddingHorizontal: s(20),
		gap: vs(4),
	},
	title: {
		...typography.headerL,
		color: Colors.BODYTEXT_SUB,
	},
	subtitle: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_SUB,
	},
})
