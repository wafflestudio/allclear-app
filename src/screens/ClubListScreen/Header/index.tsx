import { Colors } from 'constants/colors'
import { Category, CategoryMap } from 'entities/category'
import React from 'react'
import { Dimensions, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
	category?: Category['name']
	onBack: () => void
}

const Header = ({ category, onBack }: Props) => {
	const deviceWidth = Dimensions.get('window').width

	if (!category) return null

	const categoryDetail = CategoryMap[category]

	return (
		<View
			style={{
				padding: 20,
				height: deviceWidth * 0.4,
				display: 'flex',
				flexDirection: 'column',
				zIndex: 3,
			}}>
			<View
				style={{
					position: 'relative',
					flex: 1,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'flex-start',
					justifyContent: 'space-between',
					zIndex: 3,
				}}>
				<TouchableOpacity style={{ marginBottom: 12 }} onPress={onBack}>
					<Icon color={Colors.WHITE} name="arrow-left" size={24} />
				</TouchableOpacity>
			</View>

			<View style={{ marginLeft: 12 }}>
				<Text
					style={{
						color: Colors.WHITE,
						fontSize: 40,
						fontWeight: 'bold',
						letterSpacing: -2,
					}}>
					{category} 동아리
				</Text>
				<Text
					style={{
						color: Colors.WHITE,
						fontSize: 22,
						fontWeight: '600',
						letterSpacing: -1,
						lineHeight: 28,
					}}>
					{categoryDetail.description}
				</Text>
			</View>
		</View>
	)
}

export default Header
