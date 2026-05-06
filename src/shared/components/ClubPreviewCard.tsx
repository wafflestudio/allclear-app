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
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { ms, s, vs } from '@/shared/utils/scale'

type Props = {
	title: string
	description: string
	imageSource: ImageSourcePropType
	onPress?: () => void
	variant?: 'sm' | 'lg'
	style?: StyleProp<ViewStyle>
	imageStyle?: StyleProp<ImageStyle>
}

const variantStyles = {
	sm: {
		container: { width: s(100) },
		textWrapper: { paddingHorizontal: s(10), paddingVertical: vs(6) },
	},
	lg: {
		container: { width: s(140) },
		textWrapper: { paddingHorizontal: s(10), paddingVertical: vs(10) },
	},
}

const ClubPreviewCard = ({
	variant = 'sm',
	title,
	description,
	imageSource,
	onPress,
	style,
	imageStyle,
}: Props) => {
	const v = variantStyles[variant]

	return (
		<Pressable
			style={({ pressed }) => [
				styles.cardContainer,
				v.container,
				style,
				pressed && { opacity: 0.9 },
			]}
			onPress={onPress}>
			<View style={styles.imageWrapper}>
				<Image source={imageSource} style={[styles.image, imageStyle]} resizeMode="cover" />
			</View>
			<View style={[styles.textWrapper, v.textWrapper]}>
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
	cardContainer: {
		overflow: 'hidden',
		backgroundColor: Colors.WHITE,
		borderRadius: ms(15),
		shadowColor: Colors.BLACK,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.12,
		shadowRadius: 2,
		elevation: 1,
	},
	imageWrapper: {
		width: '100%',
		aspectRatio: 1,
	},
	image: {
		width: '100%',
		height: '100%',
	},
	textWrapper: {
		backgroundColor: Colors.WHITE,
	},
	title: {
		...typography.bodyMSemibold,
		color: Colors.BODYTEXT_MAIN,
		marginBottom: vs(2),
	},
	description: {
		...typography.bodySRegular,
		lineHeight: ms(15),
		color: Colors.BODYTEXT_SUB,
	},
})
