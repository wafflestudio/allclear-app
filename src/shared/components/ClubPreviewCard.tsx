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

const COLORS = {
	transparentOffWhite: 'rgba(250, 250, 250, 0)',
} as const

const CARD_WIDTH = 110
const CARD_RADIUS = 10

type Props = {
	title: string
	description: string
	imageSource: ImageSourcePropType
	onPress?: () => void
	style?: StyleProp<ViewStyle>
	imageStyle?: StyleProp<ImageStyle>
}

const ClubPreviewCard = ({
	title,
	description,
	imageSource,
	onPress,
	style,
	imageStyle,
}: Props) => {
	return (
		<Pressable
			style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}
			onPress={onPress}>
			<View style={styles.imageWrapper}>
				<Image source={imageSource} style={[styles.image, imageStyle]} resizeMode="cover" />
				<LinearGradient
					colors={[COLORS.transparentOffWhite, COLORS.transparentOffWhite, Colors.WHITE]}
					locations={[0, 0.4, 1]}
					style={styles.gradient}
				/>
			</View>
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

export default ClubPreviewCard

const styles = StyleSheet.create({
	card: {
		width: CARD_WIDTH,
		position: 'relative',
		borderRadius: CARD_RADIUS,
		overflow: 'hidden',
		backgroundColor: Colors.WHITE,
	},
	pressed: {
		opacity: 0.9,
	},
	imageWrapper: {
		width: '100%',
		aspectRatio: 1,
		position: 'relative',
	},
	image: {
		width: '100%',
		height: '100%',
	},
	gradient: {
		...StyleSheet.absoluteFillObject,
	},
	textContainer: {
		backgroundColor: Colors.WHITE,
		paddingHorizontal: 11,
		paddingBottom: 15,
	},
	title: {
		...typography.bodyMSemibold,
		color: Colors.BODYTEXT_MAIN,
	},
	description: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_SUB,
	},
})
