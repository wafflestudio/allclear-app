import { Colors } from 'shared/constants/colors'
import { Category, CategoryMap } from 'entities/category'
import { Club } from 'entities/club'
import React, { useState } from 'react'
import { Animated, Easing, Text, View } from 'react-native'
import { Blurhash } from 'react-native-blurhash'

const defaultBlurHash = 'UFE.X=9uRNtR~q9tD%bu-=D*Vss:I.Rit5sl'

type Props = {
	club: Club
	category?: Category['name']
}

const ClubListItem = ({ club, category }: Props) => {
	const [isFadeInFinished, setIsFadeInFinished] = useState(false)
	const animatedOpacityValue = React.useRef(new Animated.Value(0)).current

	const categoryDetail = category ? CategoryMap[category] : undefined

	const imageView = (
		<View
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				overflow: 'visible',
			}}>
			{!isFadeInFinished && (
				<View
					style={{
						elevation: 5,
						borderColor: Colors.FYI_GRAY_300,
						borderRadius: 4,
						borderWidth: 1,
						zIndex: 1000,
						overflow: 'hidden',
						position: 'absolute',
						left: 0,
						top: 0,
					}}>
					<Blurhash
						blurhash={club.blurHash || defaultBlurHash}
						decodeWidth={32}
						decodeHeight={32}
						style={{
							width: 100,
							height: 100,
						}}
					/>
				</View>
			)}
			<Animated.Image
				style={{
					width: 100,
					height: 100,
					borderRadius: 4,
					borderWidth: 1,
					borderColor: categoryDetail ? `${categoryDetail.safeArea}20` : Colors.FYI_GRAY_300,
					opacity: animatedOpacityValue,
				}}
				resizeMode={'contain'}
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
	)

	const textView = (
		<View style={{ width: '65%', marginTop: 2 }}>
			<View>
				<Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>{club.name}</Text>
			</View>
			<View style={{ marginBottom: 4, display: 'flex' }}>
				<Text numberOfLines={3} style={{ fontSize: 14, lineHeight: 18 }}>
					{club.description}
				</Text>
			</View>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					marginTop: 'auto',
					marginBottom: 4,
				}}>
				{club.tags?.map((tag, index) => (
					<Text
						style={{
							color: Colors.BACKGROUND_LIGHT_GRAY,
							fontSize: 12,
							marginRight: 4,
							marginBottom: 2,
						}}
						key={`${club.name}-${index}`}>{`#${tag}`}</Text>
				))}
			</View>
		</View>
	)

	const reviewView = (
		<View style={{ marginTop: 4, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
			{club.reviewKeywords?.slice(0, 2).map((keyword, index) => (
				<View
					style={{
						display: 'flex',
						width: 'auto',
						flexDirection: 'row',
						alignItems: 'center',
						alignSelf: 'flex-start',
						padding: 4,
						paddingHorizontal: 8,
						borderRadius: 32,
						borderWidth: 1,
						borderColor: categoryDetail ? categoryDetail.safeArea : Colors.FYI_GRAY_300,
					}}
					key={`${club.name}-${index}`}>
					<Text
						style={{
							fontSize: 11,
							marginRight: 4,
						}}>
						{keyword.iconUri?.trim()}
					</Text>
					<Text style={{ fontSize: 11 }}>{keyword.title}</Text>
				</View>
			))}
		</View>
	)

	return (
		<View
			style={{
				display: 'flex',
				backgroundColor: Colors.WHITE,
				padding: 12,
				paddingLeft: 16,
				borderRadius: 12,
				marginHorizontal: 20,
				marginVertical: 8,
			}}>
			<View
				style={{
					display: 'flex',
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-between',
				}}>
				{textView}
				{imageView}
			</View>
			{club.reviewKeywords && club.reviewKeywords.length > 0 && <>{reviewView}</>}
		</View>
	)
}

export default ClubListItem
