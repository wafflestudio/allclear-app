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
			style={({ pressed }) => [
				styles.shadowContainer,
				styles.cardWidth,
				style,
				pressed && { opacity: 0.9 },
			]}
			onPress={onPress}>
			<View style={styles.cardContainer}>
				<View style={styles.imageWrapper}>
					<Image source={imageSource} style={[styles.image, imageStyle]} resizeMode="cover" />
				</View>
				<View style={styles.textWrapper}>
					<Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
						{title}
					</Text>
					<Text numberOfLines={1} ellipsizeMode="tail" style={styles.description}>
						{description}
					</Text>
				</View>
			</View>
		</Pressable>
	)
}

export default ClubPreviewCard

const styles = StyleSheet.create({
	shadowContainer: {
		shadowColor: Colors.BLACK,
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.1,
		shadowRadius: 7,
		elevation: 2,
		backgroundColor: Colors.WHITE, // android에서 shadow가 보이도록 배경색 설정 필수
		borderRadius: ms(15),
	},
	cardWidth: {
		width: s(110),
	},
	cardContainer: {
		overflow: 'hidden',
		backgroundColor: Colors.WHITE,
		borderRadius: ms(15),
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
		paddingHorizontal: s(10),
		paddingTop: vs(9),
		paddingBottom: vs(8),
	},
	title: {
		...typography.bodyMSemibold,
		color: Colors.BODYTEXT_MAIN,
		marginBottom: vs(3),
	},
	description: {
		...typography.bodySRegular,
		lineHeight: ms(15),
		color: Colors.BODYTEXT_SUB,
	},
})
