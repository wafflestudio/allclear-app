import { Colors } from 'constants/colors'
import { Club } from 'entities/club'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

type Props = {
	club: Club
	onBack: () => void
}

const Header = ({ club, onBack }: Props) => {
	return (
		<View
			style={{
				padding: 20,
				paddingBottom: 8,
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
				<View style={{ marginLeft: 12 }}>
					<Text
						style={{
							color: Colors.WHITE,
							fontSize: 24,
							fontWeight: 'bold',
							letterSpacing: -2,
						}}>
						{club.name}
					</Text>
				</View>
				{/* For Margin */}
				<View style={{ width: 24 }} />
			</View>
		</View>
	)
}

export default Header
