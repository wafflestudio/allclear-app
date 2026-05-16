import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Colors } from '@/shared/constants/colors'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import { typography } from '@/shared/constants/typography'
import { s, vs } from '@/shared/utils/scale'

import SearchInput from '@/features/search/components/SearchInput'
import SearchFilterBar from '@/features/search/components/SearchFilterBar'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'

type SearchScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.SEARCH>
type SearchScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.SEARCH>

type Props = {
	route: SearchScreenRouteProp
	navigation: SearchScreenNavigationProp
}

const SearchScreen = ({ navigation }: Props) => {
	const handleSubmitQuery = (query: string) => {
		navigation.navigate(SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST, { query })
	}

	return (
		<WithViewEventLog params={{ screen_name: 'search_screen' }}>
			<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
				<View style={styles.headerContainer}>
					<Text style={styles.headerText}>어떤 동아리를 찾아볼까요?</Text>
					<SearchInput onSubmit={handleSubmitQuery} />
					<SearchFilterBar />
				</View>
				{/* TODO: 최근검색어 섹션 */}
				{/* TODO: 인기동아리 섹션 */}
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default SearchScreen

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.BACKGROUND_MAIN,
		alignItems: 'center',
		paddingTop: vs(32),
	},
	headerContainer: {
		width: s(350),
		alignItems: 'stretch',
		marginVertical: vs(10),
		gap: s(15),
	},
	headerText: {
		...typography.headerXXL,
		color: Colors.BODYTEXT_MAIN,
		paddingTop: vs(10),
		paddingRight: s(12),
		paddingBottom: vs(10),
		paddingLeft: s(5),
	},
})
