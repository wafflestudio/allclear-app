import type {
	ClubSearchAffiliationType,
	ClubSearchBooleanString,
	ClubSearchMinActivityPeriod,
	ClubSearchRecruitType,
	SearchClubsRequest,
} from '@/repositories/club'

export type ClubSearchFilters = {
	affiliation_type: ClubSearchAffiliationType
	is_recruiting?: ClubSearchBooleanString
	recruit_type?: ClubSearchRecruitType
	has_membership_fee?: ClubSearchBooleanString
	has_dongbang?: ClubSearchBooleanString
	is_official_verified?: ClubSearchBooleanString
	min_activity_period: ClubSearchMinActivityPeriod[]
}

export type ClubSearchForm = {
	query: string
	filters: ClubSearchFilters
}

export const DEFAULT_CLUB_SEARCH_FILTERS: ClubSearchFilters = {
	affiliation_type: '전체',
	min_activity_period: [],
}

export const DEFAULT_CLUB_SEARCH_FORM: ClubSearchForm = {
	query: '',
	filters: DEFAULT_CLUB_SEARCH_FILTERS,
}

export const createSearchClubsRequest = (form: ClubSearchForm): SearchClubsRequest => {
	const query = form.query.trim()

	return {
		query,
		affiliation_type:
			form.filters.affiliation_type === '전체' ? undefined : form.filters.affiliation_type,
		is_recruiting: form.filters.is_recruiting,
		recruit_type: form.filters.recruit_type,
		has_membership_fee: form.filters.has_membership_fee,
		has_dongbang: form.filters.has_dongbang,
		is_official_verified: form.filters.is_official_verified,
		min_activity_period:
			form.filters.min_activity_period.length > 0 ? form.filters.min_activity_period : undefined,
	}
}
