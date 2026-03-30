import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Colors } from 'constants/colors'
import { SCREEN_TYPE, StackParamList } from 'entities/screen'
import React, { useState } from 'react'
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native'
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
		<View style={styles.container}>
			<View style={styles.titleSection}>
				<View>
					<Text style={styles.subtitle}>{`서울대 모든 동아리`}</Text>
				</View>
				<View style={styles.logoRow}>
					<Image
						resizeMethod="resize"
						style={styles.logo}
						source={require('../../../assets/images/header/allclear.png')}
					/>
				</View>
			</View>
			<View style={styles.searchSection}>
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
					containerStyle={styles.inputContainer}
					inputStyle={styles.input}
					inputContainerStyle={styles.inputInnerContainer}
					errorStyle={styles.hiddenError}
				/>
			</View>
		</View>
	)
}

export default Header

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.WHITE,
	},
	titleSection: {
		paddingHorizontal: 32,
		paddingTop: 20,
		alignItems: 'flex-start',
		justifyContent: 'center',
	},
	subtitle: {
		fontSize: 14,
		fontWeight: 'normal',
		lineHeight: 16,
		paddingBottom: 8,
	},
	logoRow: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	logo: {
		width: 88,
		height: 28,
	},
	searchSection: {
		marginTop: 12,
		paddingHorizontal: 24,
		paddingVertical: 8,
	},
	inputContainer: {
		backgroundColor: Colors.WHITE,
		borderColor: Colors.FYI_GRAY_300,
		borderRadius: 8,
		borderWidth: 1,
		height: 48,
	},
	input: {
		fontSize: 14,
		padding: 4,
		color: Colors.FYI_BLACK,
	},
	inputInnerContainer: {
		borderBottomWidth: 0,
		height: 48,
	},
	hiddenError: {
		display: 'none',
	},
})
