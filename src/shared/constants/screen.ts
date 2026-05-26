import { Club } from '@/entities/club'

export enum SCREEN_TYPE {
	HOME = 'Home',

	CLUB_LIST = 'ClubList',
	SEARCH_RESULT_CLUB_LIST = 'SearchResultClubList',
	SAVED_CLUB_LIST = 'SavedClubList',

	CLUB_DETAIL = 'ClubDetail',
	CLUB_REVIEW = 'ClubReview',
	CLUB_RANKING = 'ClubRanking',

	MYPAGE = 'MyPage',
	EDIT_PROFILE = 'EditProfile',
	MANAGE_CLUB_REGISTRATION = 'ManageClubRegistration',

	WEBVIEW = 'WebView',
}

export type StackParamList = {
	[SCREEN_TYPE.HOME]: undefined

	[SCREEN_TYPE.CLUB_LIST]: {
		name?: Club['name']
		category?: Club['category']
	}
	[SCREEN_TYPE.SEARCH_RESULT_CLUB_LIST]: {
		query: string
	}
	[SCREEN_TYPE.SAVED_CLUB_LIST]: undefined

	[SCREEN_TYPE.CLUB_DETAIL]: {
		uuid: Club['uuid']
		category?: Club['category']
		entry_point?: 'home' | 'search_result' | 'club_list' | 'club_detail' | 'club_review'
	}
	[SCREEN_TYPE.CLUB_REVIEW]: {
		uuid: Club['uuid']
		category: Club['category']
	}
	[SCREEN_TYPE.CLUB_RANKING]: undefined

	[SCREEN_TYPE.EDIT_PROFILE]: undefined
	[SCREEN_TYPE.MYPAGE]: undefined
	[SCREEN_TYPE.MANAGE_CLUB_REGISTRATION]: undefined

	[SCREEN_TYPE.WEBVIEW]: { uri: string; authorization?: string }
}
