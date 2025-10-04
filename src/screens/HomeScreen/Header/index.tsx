import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Colors } from 'constants/colors'
import { SCREEN_TYPE, StackParamList } from 'entities/screen'
import React, { useState } from 'react'
import { View, Image, TouchableOpacity, Text } from 'react-native'
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/AntDesign'

type NavigationProps = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.HOME>

const Header = () => {
	const navigation = useNavigation<NavigationProps>()
	const [searchText, setSearchText] = useState('')

	const handleClearText = () => setSearchText('')

	const handleSubmitText = () => {
		if (searchText) navigation.navigate(SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST, { query: searchText })
	}

	return (
		<View style={{ backgroundColor: Colors.WHITE }}>
			<View
				style={{
					paddingHorizontal: 32,
					paddingTop: 20,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'flex-start',
					justifyContent: 'center',
				}}>
				<View>
					<Text
						style={{
							fontSize: 14,
							fontWeight: 'normal',
							lineHeight: 16,
							paddingBottom: 8,
						}}>{`서울대 모든 동아리`}</Text>
				</View>
				<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
					<Image
						resizeMethod="resize"
						style={{ width: 88, height: 28 }}
						source={require('../../../assets/images/header/allclear.png')}
					/>
				</View>
			</View>
			<View
				style={{
					marginTop: 12,
					paddingHorizontal: 24,
					paddingVertical: 8,
				}}>
				<Input
					keyboardType="default"
					value={searchText}
					onChangeText={setSearchText}
					onSubmitEditing={handleSubmitText}
					placeholder="밴드 동아리"
					placeholderTextColor={Colors.FYI_GRAY_600}
					leftIcon={<Icon name="search1" size={20} style={{ marginLeft: 4 }} color="#000" />}
					rightIcon={
						searchText ? (
							<TouchableOpacity onPress={handleClearText}>
								<Icon name="close" size={20} color="#000" />
							</TouchableOpacity>
						) : undefined
					}
					containerStyle={{
						backgroundColor: Colors.WHITE,
						borderColor: Colors.FYI_GRAY_300,
						borderRadius: 8,
						borderWidth: 1,
						height: 48,
					}}
					inputStyle={{
						fontSize: 14,
						padding: 4,
						color: Colors.FYI_BLACK,
					}}
					inputContainerStyle={{ borderBottomWidth: 0, height: 48 }}
					errorStyle={{ display: 'none' }}
				/>
			</View>
		</View>
	)
}

export default Header
