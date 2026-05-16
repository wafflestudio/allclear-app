import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import { Club } from '@/entities/club'
import RecentSearches from '@/features/search/components/RecentSearches'
import SearchFilterBar, {
	AffiliationFilter,
} from '@/features/search/components/SearchFilterBar'
import SearchInput from '@/features/search/components/SearchInput'
import SearchResultList from '@/features/search/components/SearchResultList'
import TypoCorrectionNotice from '@/features/search/components/TypoCorrectionNotice'
import { ListSavedClubsResponse, SearchClubsResponse } from '@/repositories/club'
import { Colors } from '@/shared/constants/colors'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import { typography } from '@/shared/constants/typography'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { useProfile } from '@/shared/contexts/profileContext'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import { s, vs } from '@/shared/utils/scale'

type SearchScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.SEARCH>
type SearchScreenNavigationProp = NativeStackNavigationProp<StackParamList, SCREEN_TYPE.SEARCH>

type Props = {
	route: SearchScreenRouteProp
	navigation: SearchScreenNavigationProp
}

const SearchScreen = ({ navigation }: Props) => {
	const queryClient = useQueryClient()
	const { clubService } = useContext(serviceContext)
	const { user } = useProfile()

	const [inputValue, setInputValue] = useState('')
	const [submittedQuery, setSubmittedQuery] = useState('')
	const [isTypoNoticeVisible, setIsTypoNoticeVisible] = useState(true)
	const [affiliationFilter, setAffiliationFilter] = useState<AffiliationFilter>('central')
	const [isRecruitingOnly, setIsRecruitingOnly] = useState(false)
	const [recentSearches, setRecentSearches] = useState<string[]>([])

	const { data: searchResult } = useSearchClubs({ query: submittedQuery })
	const { data: savedClubs } = useSavedClubs()

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
	const savedClubIds = useMemo(() => {
		return new Set(savedClubs?.map(club => club.uuid) ?? [])
	}, [savedClubs])

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
		setRecentSearches([])
	}

	const openDetailPage = (club: Club) => {
		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'search_result',
		})
	}

	const handleToggleSavedClub = async (club: Club) => {
		if (!user) {
			Toast.show({
				type: 'info',
				text1: '로그인이 필요해요',
				position: 'bottom',
				visibilityTime: 2000,
			})
			return
		}

		const isSaved = savedClubIds.has(club.uuid)
		const previousSavedClubs = queryClient.getQueryData<ListSavedClubsResponse>(['savedClubs'])

		queryClient.setQueryData<ListSavedClubsResponse>(['savedClubs'], previous => {
			const previousClubs = previous?.clubs ?? []
			const nextClubs = isSaved
				? previousClubs.filter(savedClub => savedClub.uuid !== club.uuid)
				: [club, ...previousClubs.filter(savedClub => savedClub.uuid !== club.uuid)]

			return {
				clubs: nextClubs,
				totalSize: nextClubs.length,
			}
		})

		try {
			if (isSaved) {
				await clubService.removeSavedClub({ clubId: club.uuid })
			} else {
				await clubService.createSavedClub({ clubId: club.uuid })
				Toast.show({
					type: 'info',
					text1: '동아리가 저장되었어요!',
					position: 'bottom',
					visibilityTime: 2000,
				})
			}
			queryClient.invalidateQueries(['savedClubs'])
		} catch {
			queryClient.setQueryData(['savedClubs'], previousSavedClubs)
			Toast.show({
				type: 'info',
				text1: '이런! 문제가 생겼어요!',
				position: 'bottom',
				visibilityTime: 2000,
			})
		}
	}

	return (
		<WithViewEventLog params={{ screen_name: 'search_screen' }}>
			<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
				<View style={styles.headerContainer}>
					<Pressable onPress={resetToInitialState}>
						<Text style={styles.headerText}>어떤 동아리를 찾아볼까요?</Text>
					</Pressable>
					<SearchInput
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
						<SearchResultList
							clubs={filteredClubs}
							savedClubIds={savedClubIds}
							onPressClub={openDetailPage}
							onToggleSaved={handleToggleSavedClub}
							emptyPlaceholder={'앗 검색 결과가 없어요!\n다른 키워드로 검색해주세요'}
						/>
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
}

const useSearchClubs = ({ query }: UseSearchClubsProps) => {
	const { clubService } = useContext(serviceContext)

	return useQuery<SearchClubsResponse>(
		['searchClubs', query],
		() => clubService.searchClubs({ query }),
		{
			enabled: query.length > 0,
			keepPreviousData: true,
		},
	)
}

const useSavedClubs = () => {
	const { user } = useProfile()
	const { clubService } = useContext(serviceContext)

	return useQuery(['savedClubs'], () => clubService.listSavedClubs(), {
		select: data => data.clubs,
		enabled: !!user,
	})
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.BACKGROUND_MAIN,
		paddingTop: vs(32),
	},
	headerContainer: {
		paddingHorizontal: s(20),
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
		gap: vs(20),
	},
})
