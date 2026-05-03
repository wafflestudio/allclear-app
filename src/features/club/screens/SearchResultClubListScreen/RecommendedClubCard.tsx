import React from 'react'
import {
	Image,
	ImageSourcePropType,
	ImageStyle,
	Pressable,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

const COLORS = {
	offWhite: Colors.BACKGROUND_MAIN,
	title: Colors.BODYTEXT_MAIN,
	description: Colors.BODYTEXT_SUB,
	transparentOffWhite: 'rgba(250, 250, 250, 0)',
} as const

const CARD_WIDTH = s(140)
const CARD_RADIUS = ms(10)

type Props = {
	title: string
	description: string
	imageSource: ImageSourcePropType
	onPress?: () => void
	style?: StyleProp<ViewStyle>
	imageStyle?: StyleProp<ImageStyle>
}

const RecommendedClubCard = ({ title, description, imageSource, onPress, style, imageStyle }: Props) => {
	return (
		<Pressable style={({ pressed }) => [styles.card, style, pressed && styles.pressed]} onPress={onPress}>
			<View style={styles.imageWrapper}>
				<Image source={imageSource} style={[styles.image, imageStyle]} resizeMode="cover" />
			</View>
			<LinearGradient
				colors={[COLORS.transparentOffWhite, COLORS.offWhite]}
				locations={[0.4638, 0.6473]}
				style={styles.gradient}
			/>
			<View style={styles.textContainer}>
				<Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
					{title}
				</Text>
				<Text numberOfLines={2} ellipsizeMode="tail" style={styles.description}>
					{description}
				</Text>
			</View>
		</Pressable>
	)
}

export default RecommendedClubCard

const styles = StyleSheet.create({
	card: {
		width: CARD_WIDTH,
		position: 'relative',
		borderRadius: CARD_RADIUS,
		overflow: 'hidden',
		backgroundColor: COLORS.offWhite,
	},
	pressed: {
		opacity: 0.9,
	},
	imageWrapper: {
		width: '100%',
		aspectRatio: 1,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	gradient: {
		...StyleSheet.absoluteFillObject,
		borderRadius: CARD_RADIUS,
	},
	textContainer: {
		paddingHorizontal: s(11),
		paddingBottom: vs(15),
	},
	title: {
		...typography.bodyMSemibold,
		color: COLORS.title,
		marginBottom: vs(4),
	},
	description: {
		...typography.bodySRegular,
		color: COLORS.description,
	},
})
