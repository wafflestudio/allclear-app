import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { Club } from '@/entities/club'
import ClubPreviewCard from '@/shared/components/ClubPreviewCard'
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
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={styles.scrollContent}>
				{clubs.map(club => (
					<ClubPreviewCard
						key={club.uuid}
						title={club.name}
						description={club.description ?? ''}
						imageSource={{ uri: club.imageUri }}
						onPress={() => onPressClub(club)}
					/>
				))}
			</ScrollView>
		</View>
	)
}

export default RandomRecommendations

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.BACKGROUND_SUB,
		borderTopLeftRadius: s(20),
		borderTopRightRadius: s(20),
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
		color: Colors.BODYTEXT_MAIN,
	},
	subtitle: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_SUB,
	},
	scrollContent: {
		paddingHorizontal: s(20),
		gap: s(10),
	},
})
