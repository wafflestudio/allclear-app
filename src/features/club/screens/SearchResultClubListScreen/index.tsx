import { RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { Club } from '@/entities/club'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { View, StyleSheet } from 'react-native'
import { useProfile } from '@/shared/contexts/profileContext'
import { ListSavedClubsResponse, SearchClubsResponse } from '@/repositories/club'
import { vs, s } from '@/shared/utils/scale'
import SearchResultHeader from '@/features/club/components/SearchResultClubList/SearchResultHeader'
import SearchInput from '@/features/club/components/SearchResultClubList/SearchInput'
import TypoCorrectionNotice from '@/features/club/components/SearchResultClubList/TypoCorrectionNotice'
import SearchFilterBar, {
	AffiliationFilter,
} from '@/features/club/components/SearchResultClubList/SearchFilterBar'
import SearchResultList from '@/features/club/components/SearchResultClubList/SearchResultList'

type DetailsScreenRouteProp = RouteProp<StackParamList, SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST>
type DetailsScreenNavigationProp = NativeStackNavigationProp<
	StackParamList,
	SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST
>

type Props = {
	route: DetailsScreenRouteProp
	navigation: DetailsScreenNavigationProp
}

const SearchResultClubListScreen = ({ route, navigation }: Props) => {
	const { query } = route.params
	const queryClient = useQueryClient()
	const { clubService } = useContext(serviceContext)
	const { user } = useProfile()
	const [isTypoNoticeVisible, setIsTypoNoticeVisible] = useState(true)
	const [displayedCount, setDisplayedCount] = useState(0)
	const [affiliationFilter, setAffiliationFilter] = useState<AffiliationFilter>('central')
	const [isRecruitingOnly, setIsRecruitingOnly] = useState(false)

	const { data: searchResult } = useSearchClubs({ query })
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
	const totalSize = filteredClubs?.length ?? searchResult?.totalSize ?? clubs?.length ?? 0
	const effectiveDisplayedCount = Math.min(displayedCount, totalSize)
	const savedClubIds = useMemo(() => {
		return new Set(savedClubs?.map(club => club.uuid) ?? [])
	}, [savedClubs])

	const shouldShowTypoNotice =
		isTypoNoticeVisible && !!searchResult?.isTypoCorrected && !!searchResult.correctedQuery

	const openDetailPage = (club: Club) => {
		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'search_result',
		})
	}

	const handleSubmitSearch = (nextQuery: string) => {
		setIsTypoNoticeVisible(true)
		navigation.navigate(SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST, { query: nextQuery })
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

	const handleDisplayedCountChange = useCallback((count: number) => {
		setDisplayedCount(count)
	}, [])

	return (
		<WithViewEventLog
			params={{
				screen_name: 'search_result_screen',
				search_query: query,
			}}>
			<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
				<SearchResultHeader />
				<View style={styles.searchControls}>
					<SearchInput
						query={query}
						displayedCount={effectiveDisplayedCount}
						totalCount={totalSize}
						onSubmit={handleSubmitSearch}
					/>
					{shouldShowTypoNotice ? (
						<TypoCorrectionNotice
							correctedQuery={searchResult.correctedQuery!}
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
					onDisplayedCountChange={handleDisplayedCountChange}
					emptyPlaceholder="앗 검색 결과가 없어요!\n다른 키워드로 검색해주세요"
				/>
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default SearchResultClubListScreen

type UseCategoryClubsProps = {
	query: string
}

const useSearchClubs = ({ query }: UseCategoryClubsProps) => {
	const { clubService } = useContext(serviceContext)

	return useQuery<SearchClubsResponse>(
		['searchClubs', query],
		() => clubService.searchClubs({ query }),
		{
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
	},
	searchControls: {
		width: '100%',
		gap: vs(14),
		paddingHorizontal: s(20),
		paddingTop: vs(5),
		paddingBottom: vs(10),
		backgroundColor: Colors.BACKGROUND_MAIN,
	},
})
