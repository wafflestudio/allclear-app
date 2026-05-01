import { Colors } from '@/shared/constants/colors'
import { Category, CategoryMap } from '@/entities/category'
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
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					minHeight: 28,
					zIndex: 3,
				}}>
				<TouchableOpacity
					style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}
					onPress={onBack}>
					<Icon color={'#FFFFFF' /* #deprecated color */} name="chevron-left" size={24} />
				</TouchableOpacity>
			</View>

			<View style={{ marginLeft: 12 }}>
				<Text
					style={{
						color: '#FFFFFF', // #deprecated color
						fontSize: 40,
						fontWeight: 'bold',
						letterSpacing: -2,
					}}>
					{category} 동아리
				</Text>
				<Text
					style={{
						color: '#FFFFFF', // #deprecated color
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
