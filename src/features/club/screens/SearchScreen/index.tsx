import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Club } from '@/entities/club'
import ClubList from '@/features/club/components/ClubList/ClubList'
import PopularClubs from '@/features/club/components/PopularClubs/PopularClubs'
import RecentSearches from '@/features/club/components/RecentSearches/RecentSearches'
import SearchBar from '@/features/club/components/SearchBar/SearchBar'
import SearchFilterBar, {
	AffiliationFilter,
} from '@/features/club/components/SearchFilterBar/SearchFilterBar'
import TypoCorrectionNotice from '@/features/club/components/TypoCorrectionNotice/TypoCorrectionNotice'
import { SearchClubsResponse } from '@/repositories/club'
import { Colors } from '@/shared/constants/colors'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import { typography } from '@/shared/constants/typography'
import { serviceContext } from '@/shared/contexts/serviceContext'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import { s, vs } from '@/shared/utils/scale'

const RECENT_SEARCHES_QUERY_KEY = ['recentSearches'] as const

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
	const [affiliationFilter, setAffiliationFilter] = useState<AffiliationFilter>('central')
	const [isRecruitingOnly, setIsRecruitingOnly] = useState(false)

	const { data: searchResult, isFetching } = useSearchClubs({ query: submittedQuery })
	const { data: recentSearches } = useRecentSearches()
	const { mutate: clearRecentSearches } = useClearRecentSearches()

	const clubs = searchResult?.clubs
	const filteredClubs = useMemo(() => {
		if (!clubs) return undefined

		return clubs.filter(club => {
			const type = club.type?.toLowerCase() ?? ''
			const matchesAffiliation =
				affiliationFilter === 'all' ||
				(affiliationFilter === 'central' && (type.includes('중앙') || type.includes('central'))) ||
				(affiliationFilter === 'college' &&
					(type.includes('학과') || type.includes('단과') || type.includes('college')))
			const matchesRecruiting =
				!isRecruitingOnly || club.articleUploadedAt !== null || !!club.article?.trim()

			return matchesAffiliation && matchesRecruiting
		})
	}, [affiliationFilter, clubs, isRecruitingOnly])

	const hasSubmittedQuery = submittedQuery.length > 0
	const shouldShowTypoNotice =
		isTypoNoticeVisible && !!searchResult?.isTypoCorrected && !!searchResult.correctedQuery

	const resetSearchState = useCallback(() => {
		setInputValue('')
		setSubmittedQuery('')
		setIsTypoNoticeVisible(true)
		setAffiliationFilter('central')
		setIsRecruitingOnly(false)
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
		clearRecentSearches()
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
					<SearchBar
						value={inputValue}
						onChangeText={setInputValue}
						onSubmit={handleSubmitQuery}
					/>
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
								selectedFilter={affiliationFilter}
								isRecruitingOnly={isRecruitingOnly}
								onChangeFilter={setAffiliationFilter}
								onToggleRecruitingOnly={() => setIsRecruitingOnly(prev => !prev)}
							/>
						</View>
						<ClubList
							clubs={filteredClubs}
							openDetailPage={openDetailPage}
							emptyPlaceholder={'앗 검색 결과가 없어요!\n다른 키워드로 검색해주세요'}
							isLoading={isFetching}
						/>
					</>
				) : (
					<View style={styles.placeholderContainer}>
						<RecentSearches
							searches={recentSearches ?? []}
							onPressItem={handleSelectRecentSearch}
							onClearAll={handleClearRecentSearches}
						/>
						<PopularClubs />
					</View>
				)}
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default SearchScreen

type UseSearchClubsProps = {
	query: string
}

const useSearchClubs = ({ query }: UseSearchClubsProps) => {
	const { clubService } = useContext(serviceContext)
	const queryClient = useQueryClient()

	return useQuery<SearchClubsResponse>(
		['searchClubs', query],
		() => clubService.searchClubs({ query }),
		{
			enabled: query.length > 0,
			keepPreviousData: true,
			onSuccess: () => {
				queryClient.invalidateQueries(RECENT_SEARCHES_QUERY_KEY)
			},
		},
	)
}

const useRecentSearches = () => {
	const { recentSearchService } = useContext(serviceContext)

	return useQuery(
		RECENT_SEARCHES_QUERY_KEY,
		() => recentSearchService.listRecentSearches(),
		{
			staleTime: 0,
			select: data => data.recentSearches.map(it => it.query),
		},
	)
}

const useClearRecentSearches = () => {
	const { recentSearchService } = useContext(serviceContext)
	const queryClient = useQueryClient()

	return useMutation(() => recentSearchService.deleteAllRecentSearches(), {
		onSuccess: () => {
			queryClient.invalidateQueries(RECENT_SEARCHES_QUERY_KEY)
		},
	})
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
	placeholderContainer: {
		paddingHorizontal: s(20),
		paddingTop: vs(14),
		gap: vs(30),
	},
})
