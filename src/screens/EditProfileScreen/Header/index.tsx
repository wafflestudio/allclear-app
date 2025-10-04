import { Colors } from 'constants/colors'
import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
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
				alignItems: 'center',
				zIndex: 3,
			}}>
			<TouchableOpacity
				style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
				onPress={onBack}>
				<Icon name="arrow-left" size={24} />
			</TouchableOpacity>
			<View style={{ flex: 1 }}>
				<Text
					style={{
						textAlign: 'center',
						marginRight: 24,
						fontSize: 14,
						fontWeight: 'bold',
						color: Colors.GRAY_50,
					}}>
					프로필 수정
				</Text>
			</View>
		</View>
	)
}

export default Header
