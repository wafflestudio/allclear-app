import { Colors } from '@/shared/constants/colors'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
	onBack: () => void
}

const Header = ({ onBack }: Props) => {
	return (
		<View
			style={{
				position: 'relative',
				padding: 20,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'flex-start',
				justifyContent: 'space-between',
				zIndex: 3,
			}}>
			<TouchableOpacity
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
				onPress={onBack}>
				<Icon name="chevron-left" size={24} />
			</TouchableOpacity>
			<View style={{ marginLeft: 12 }}>
				<Text
					style={{
						color: '#3A3434', // #deprecated color
						fontSize: 14,
						fontWeight: 'bold',
						letterSpacing: -0.5,
					}}>
					저장한 동아리
				</Text>
			</View>
			{/* For Margin */}
			<View style={{ width: 24 }} />
		</View>
	)
}

export default Header
