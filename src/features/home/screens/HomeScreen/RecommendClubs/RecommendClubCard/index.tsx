import { Colors } from '@/shared/constants/colors'
import { Club } from '@/entities/club'
import { useRef, useState } from 'react'
import { Animated, Easing, StyleSheet, Text, View } from 'react-native'
import { Blurhash } from 'react-native-blurhash'

type Props = {
	club: Club
}

const RecommendClubCard = ({ club }: Props) => {
	const [isFadeInFinished, setIsFadeInFinished] = useState(false)
	const animatedOpacityValue = useRef(new Animated.Value(0)).current

	return (
		<View style={styles.card}>
			<View style={styles.imageWrapper}>
				{!isFadeInFinished && (
					<View style={styles.blurOverlay}>
						<Blurhash
							blurhash={club.blurHash || 'UFE.X=9uRNtR~q9tD%bu-=D*Vss:I.Rit5sl'}
							decodeWidth={32}
							decodeHeight={32}
							style={styles.image}
						/>
					</View>
				)}
				<Animated.Image
					style={[styles.image, styles.roundedImage, { opacity: animatedOpacityValue }]}
					source={{ uri: club.imageUri }}
					onLoad={() => {
						if (isFadeInFinished) return
						Animated.timing(animatedOpacityValue, {
							toValue: 1,
							delay: 0,
							isInteraction: false,
							useNativeDriver: true,
							easing: Easing.in(Easing.ease),
						}).start(() => setIsFadeInFinished(true))
					}}
				/>
			</View>
			<View style={styles.content}>
				<View style={styles.titleWrapper}>
					<Text style={styles.title}>{club.name}</Text>
				</View>
				<View>
					<Text style={styles.description}>
						{club.description && club.description.length > 10
							? club.description.substring(0, 10) + '...'
							: club.description}
					</Text>
				</View>
			</View>
		</View>
	)
}

export default RecommendClubCard

const styles = StyleSheet.create({
	card: {
		width: 150,
		height: 140,
		marginRight: 12,
		paddingTop: 0,
		padding: 8,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: Colors.FYI_GRAY_300,
	},
	imageWrapper: {
		position: 'relative',
		marginBottom: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	blurOverlay: {
		elevation: 5,
		borderRadius: 12,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		overflow: 'hidden',
		position: 'absolute',
		top: 0,
	},
	image: {
		width: 148,
		height: 75,
	},
	roundedImage: {
		borderRadius: 12,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
	},
	content: {
		padding: 4,
	},
	titleWrapper: {
		marginBottom: 8,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 14,
		color: '#030712',
	},
	description: {
		fontSize: 12,
		color: Colors.GRAY_40,
	},
})
