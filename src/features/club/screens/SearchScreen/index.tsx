import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Club } from '@/entities/club'
import ClubList from '@/features/club/components/ClubList/ClubList'
import RecentSearches from '@/features/club/components/RecentSearches/RecentSearches'
import SearchBar from '@/features/club/components/SearchBar/SearchBar'
import SearchFilterBar from '@/features/club/components/SearchBar/SearchFilterBar'
import SearchFilterOverlay from '@/features/club/components/SearchBar/SearchFilterOverlay'
import TypoCorrectionNotice from '@/features/club/components/TypoCorrectionNotice/TypoCorrectionNotice'
import {
	type ClubSearchFilters,
	createSearchClubsRequest,
	DEFAULT_CLUB_SEARCH_FILTERS,
	resetClubSearchOverlayFilters,
} from '@/features/search/types/clubSearchForm'
import { SearchClubsResponse } from '@/repositories/club'
import { Colors } from '@/shared/constants/colors'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import { typography } from '@/shared/constants/typography'
import { serviceContext } from '@/shared/contexts/serviceContext'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import { s, vs } from '@/shared/utils/scale'

type SearchScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.SEARCH>
type SearchScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.SEARCH>

type Props = {
	route: SearchScreenRouteProp
	navigation: SearchScreenNavigationProp
}

const SearchScreen = ({ navigation }: Props) => {
	const [inputValue, setInputValue] = useState('')
	const [submittedQuery, setSubmittedQuery] = useState('')
	const [isTypoNoticeVisible, setIsTypoNoticeVisible] = useState(true)
	const [filters, setFilters] = useState<ClubSearchFilters>(DEFAULT_CLUB_SEARCH_FILTERS)
	const [isFilterOverlayVisible, setIsFilterOverlayVisible] = useState(false)
	const [recentSearches, setRecentSearches] = useState<string[]>([])

	const request = createSearchClubsRequest({ query: submittedQuery, filters })
	const { data: searchResult, isFetching } = useSearchClubs({ query: submittedQuery, request })

	const clubs = searchResult?.clubs

	const hasSubmittedQuery = submittedQuery.length > 0
	const shouldShowTypoNotice =
		isTypoNoticeVisible && !!searchResult?.isTypoCorrected && !!searchResult.correctedQuery

	const resetSearchState = useCallback(() => {
		setInputValue('')
		setSubmittedQuery('')
		setIsTypoNoticeVisible(true)
		setFilters(DEFAULT_CLUB_SEARCH_FILTERS)
		setIsFilterOverlayVisible(false)
	}, [])

	const resetToInitialState = useCallback(() => {
		navigation.reset({
			index: 0,
			routes: [{ name: SCREEN_TYPE.SEARCH }],
		})
		resetSearchState()
	}, [navigation, resetSearchState])

	useEffect(() => {
		const parent = navigation.getParent()
		if (!parent) return undefined
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const unsubscribe = (parent as any).addListener('tabPress', resetToInitialState)
		return unsubscribe
	}, [navigation, resetToInitialState])

	const handleSubmitQuery = (nextQuery: string) => {
		setSubmittedQuery(nextQuery)
		setIsTypoNoticeVisible(true)
	}

	const handleSelectRecentSearch = (query: string) => {
		setInputValue(query)
		handleSubmitQuery(query)
	}

	const handleClearRecentSearches = () => {
		setRecentSearches([])
	}

	const openDetailPage = (club: Club) => {
		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'search_result',
		})
	}

	return (
		<WithViewEventLog params={{ screen_name: 'search_screen' }}>
			<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
				<View style={styles.headerContainer}>
					<Pressable onPress={resetToInitialState}>
						<Text style={styles.headerText}>어떤 동아리를 찾아볼까요?</Text>
					</Pressable>
					<SearchBar value={inputValue} onChangeText={setInputValue} onSubmit={handleSubmitQuery} />
				</View>
				{hasSubmittedQuery ? (
					<>
						<View style={styles.searchControls}>
							{shouldShowTypoNotice ? (
								<TypoCorrectionNotice
									correctedQuery={searchResult!.correctedQuery!}
									onClose={() => setIsTypoNoticeVisible(false)}
								/>
							) : null}
							<SearchFilterBar
								filters={filters}
								onChange={setFilters}
								onPressFilter={() => setIsFilterOverlayVisible(prev => !prev)}
							/>
						</View>
						<View style={styles.contentContainer}>
							<ClubList
								clubs={clubs}
								openDetailPage={openDetailPage}
								emptyPlaceholder={'앗 검색 결과가 없어요!\n다른 키워드로 검색해주세요'}
								isLoading={isFetching}
							/>
							{isFilterOverlayVisible ? (
								<SearchFilterOverlay
									value={filters}
									onChange={setFilters}
									onReset={() => setFilters(resetClubSearchOverlayFilters(filters))}
									onClose={() => setIsFilterOverlayVisible(false)}
								/>
							) : null}
						</View>
					</>
				) : (
					<View style={styles.placeholderContainer}>
						<RecentSearches
							searches={recentSearches}
							onPressItem={handleSelectRecentSearch}
							onClearAll={handleClearRecentSearches}
						/>
						{/* TODO: 인기동아리 섹션 */}
					</View>
				)}
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default SearchScreen

type UseSearchClubsProps = {
	query: string
	request: ReturnType<typeof createSearchClubsRequest>
}

const useSearchClubs = ({ query, request }: UseSearchClubsProps) => {
	const { clubService } = useContext(serviceContext)

	return useQuery<SearchClubsResponse>(
		['searchClubs', request],
		() => clubService.searchClubs(request),
		{
			enabled: query.length > 0,
			keepPreviousData: true,
		},
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.BACKGROUND_MAIN,
	},
	headerContainer: {
		paddingHorizontal: s(20),
		paddingVertical: vs(10),
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
	searchControls: {
		width: '100%',
		gap: vs(14),
		paddingHorizontal: s(20),
		paddingTop: vs(14),
		paddingBottom: vs(10),
		backgroundColor: Colors.BACKGROUND_MAIN,
	},
	contentContainer: {
		flex: 1,
		position: 'relative',
	},
	placeholderContainer: {
		paddingHorizontal: s(20),
		paddingTop: vs(14),
		gap: vs(20),
	},
})
