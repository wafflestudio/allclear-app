import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Colors } from '@/shared/constants/colors'
import { Category } from '@/entities/category'
import { SCREEN_TYPE, StackParamList } from '@/entities/screen'
import useClickEventLog from '@/shared/hooks/useClickEventLog'
import { useRef, useState } from 'react'
import { Animated, Easing, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Blurhash } from 'react-native-blurhash'

type NavigationProps = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.HOME>

type Props = {
	category: Category
}

const CategoryCard = ({ category }: Props) => {
	const { logClickEvent } = useClickEventLog()

	const [isFadeInFinished, setIsFadeInFinished] = useState(false)
	const animatedOpacityValue = useRef(new Animated.Value(0)).current

	const navigation = useNavigation<NavigationProps>()

	const handleMoveToClubList = (categoryName: Category['name']) => {
		logClickEvent({
			screen_name: 'home_screen',
			screen_component_name: 'category_card',
			category: categoryName,
		})

		navigation.navigate(SCREEN_TYPE.CLUB_LIST, { category: categoryName })
	}

	return (
		<View style={styles.wrapper}>
			<TouchableOpacity
				onPress={() => handleMoveToClubList(category.name)}
				style={styles.touchable}>
				<View style={styles.imageContainer}>
					{!isFadeInFinished && (
						<View style={styles.blurOverlay}>
							<Blurhash
								blurhash={category.blurHash || 'UFE.X=9uRNtR~q9tD%bu-=D*Vss:I.Rit5sl'}
								decodeWidth={32}
								decodeHeight={32}
								style={styles.blurHash}
							/>
						</View>
					)}
					<Animated.View
						pointerEvents="none"
						style={[styles.imageOverlay, { opacity: animatedOpacityValue }]}>
						<Image
							source={{ uri: category.thumbnailUri }}
							style={styles.thumbnail}
							onLoad={() => {
								if (isFadeInFinished) return
								Animated.timing(animatedOpacityValue, {
									toValue: 1,
									delay: 0,
									isInteraction: false,
									useNativeDriver: false,
									easing: Easing.in(Easing.ease),
								}).start(() => setIsFadeInFinished(true))
							}}
						/>
					</Animated.View>
					<View pointerEvents="none" style={styles.textOverlay}>
						<Image resizeMethod="resize" style={styles.icon} source={{ uri: category.iconUri }} />
						<Text style={styles.label}>{category.name}</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}
export default CategoryCard

const styles = StyleSheet.create({
	wrapper: {
		justifyContent: 'center',
		flex: 1,
		marginHorizontal: 4,
	},
	touchable: {
		backgroundColor: '#FFFFFF', // #deprecated color
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageContainer: {
		position: 'relative',
		borderRadius: 8,
		overflow: 'hidden',
		width: '100%',
		height: 90,
		alignItems: 'flex-start',
		justifyContent: 'flex-end',
		marginBottom: 8,
	},
	blurOverlay: {
		position: 'absolute',
		zIndex: 1,
		width: '100%',
		left: 0,
		top: 0,
	},
	blurHash: {
		width: '100%',
		height: 90,
	},
	imageOverlay: {
		position: 'absolute',
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		zIndex: 2,
	},
	thumbnail: {
		width: '100%',
		height: 90,
	},
	textOverlay: {
		position: 'absolute',
		left: 8,
		bottom: 8,
		zIndex: 3,
		elevation: 12,
		flexDirection: 'row',
		alignItems: 'center',
	},
	icon: {
		width: 32,
		height: 32,
	},
	label: {
		color: '#FFFFFF', // #deprecated color
		fontSize: 14,
		lineHeight: 16,
		letterSpacing: -1,
		fontWeight: '700',
		marginLeft: 4,
	},
})
