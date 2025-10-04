import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Colors } from 'constants/colors'
import { Category } from 'entities/category'
import { SCREEN_TYPE, StackParamList } from 'entities/screen'
import useClickEventLog from 'hooks/useClickEventLog'
import React, { useState } from 'react'
import { Animated, Easing, Image, Text, TouchableOpacity, View } from 'react-native'
import { Blurhash } from 'react-native-blurhash'

type NavigationProps = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.HOME>

type Props = {
	category: Category
}

const CategoryCard = ({ category }: Props) => {
	const { logClickEvent } = useClickEventLog()

	const [isFadeInFinished, setIsFadeInFinished] = useState(false)
	const animatedOpacityValue = React.useRef(new Animated.Value(0)).current

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
		<View style={{ display: 'flex', justifyContent: 'center', flex: 1, marginHorizontal: 4 }}>
			<TouchableOpacity
				onPress={() => handleMoveToClubList(category.name)}
				style={{
					backgroundColor: Colors.WHITE,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<View
					style={{
						position: 'relative',
						borderRadius: 8,
						width: '100%',
						height: 90,
						display: 'flex',
						alignItems: 'flex-start',
						justifyContent: 'flex-end',
						marginBottom: 8,
					}}>
					{!isFadeInFinished && (
						<View
							style={{
								elevation: 5,
								borderRadius: 8,
								zIndex: 100,
								overflow: 'hidden',
								position: 'absolute',
								width: '100%',
								left: 0,
								top: 0,
							}}>
							<Blurhash
								blurhash={category.blurHash || 'UFE.X=9uRNtR~q9tD%bu-=D*Vss:I.Rit5sl'}
								decodeWidth={32}
								decodeHeight={32}
								style={{
									width: '100%',
									height: 90,
								}}
							/>
						</View>
					)}
					<Animated.Image
						style={{
							width: '100%',
							height: 90,
							borderRadius: 8,
							position: 'absolute',
							opacity: animatedOpacityValue,
						}}
						source={{ uri: category.thumbnailUri }}
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
					<View
						style={{
							marginLeft: 8,
							marginBottom: 8,
							zIndex: 200,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}>
						<Image
							resizeMethod="resize"
							style={{ width: 32, height: 32 }}
							source={{ uri: category.iconUri }}
						/>
						<Text
							style={{
								color: 'white',
								fontSize: 14,
								lineHeight: 16,
								letterSpacing: -1,
								fontWeight: '700',
								marginLeft: 4,
							}}>
							{category.name}
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	)
}
export default CategoryCard
