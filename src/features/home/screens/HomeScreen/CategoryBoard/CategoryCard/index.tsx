import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Colors } from 'constants/colors'
import { Category } from 'entities/category'
import { SCREEN_TYPE, StackParamList } from 'entities/screen'
import useClickEventLog from 'hooks/useClickEventLog'
import React, { useState } from 'react'
import { Animated, Easing, Image, Text, TouchableOpacity, View } from 'react-native'

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
						overflow: 'hidden',
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
								position: 'absolute',
								zIndex: 1,
								width: '100%',
								left: 0,
								top: 0,
							}}></View>
					)}
					<Animated.View
						pointerEvents="none"
						style={{
							position: 'absolute',
							left: 0,
							top: 0,
							right: 0,
							bottom: 0,
							zIndex: 2,
							opacity: animatedOpacityValue,
						}}>
						<Image
							source={{ uri: category.thumbnailUri }}
							style={{
								width: '100%',
								height: 90,
							}}
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
					<View
						pointerEvents="none"
						style={{
							position: 'absolute',
							left: 8,
							bottom: 8,
							zIndex: 3,
							elevation: 12,
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
