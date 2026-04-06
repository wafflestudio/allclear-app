import { Colors } from 'constants/colors'
import { Club } from 'entities/club'
import React, { useState } from 'react'
import { Animated, Easing, Text, View } from 'react-native'

type Props = {
	club: Club
}

const RecommandClubCard = ({ club }: Props) => {
	const [isFadeInFinished, setIsFadeInFinished] = useState(false)
	const animatedOpacityValue = React.useRef(new Animated.Value(0)).current

	return (
		<View
			style={{
				display: 'flex',
				width: 150,
				height: 140,
				marginRight: 12,
				paddingTop: 0,
				padding: 8,
				borderRadius: 12,
				borderWidth: 1,
				borderColor: Colors.FYI_GRAY_300,
			}}>
			<View
				style={{
					position: 'relative',
					marginBottom: 12,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				{!isFadeInFinished && (
					<View
						style={{
							elevation: 5,
							borderRadius: 12,
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
							overflow: 'hidden',
							position: 'absolute',
							top: 0,
						}}></View>
				)}
				<Animated.Image
					style={{
						width: 148,
						height: 75,
						borderRadius: 12,
						borderBottomLeftRadius: 0,
						borderBottomRightRadius: 0,
						opacity: animatedOpacityValue,
					}}
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
			<View style={{ padding: 4 }}>
				<View style={{ marginBottom: 8 }}>
					<Text style={{ fontWeight: 'bold', fontSize: 14, color: '#030712' }}>{club.name}</Text>
				</View>
				<View>
					<Text style={{ fontSize: 12, color: Colors.GRAY_40 }}>
						{club.description && club.description.length > 10
							? club.description.substring(0, 10) + '...'
							: club.description}
					</Text>
				</View>
			</View>
		</View>
	)
}

export default RecommandClubCard
