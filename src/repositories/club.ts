import { Club, ClubRanking } from '@/entities/club'
import { apiConnector } from '@/shared/utils/api'

export type SearchClubsRequest = {
	query: string
}

export type SearchClubsResponse = {
	clubs: Club[]
	totalSize: number
}

export type ListPopularClubsResponse = {
	clubs: Club[]
	totalSize: number
}

export type ListLatestClubsResponse = {
	clubs: Club[]
	totalSize: number
}

export type ListClubsRequest = {
	category?: Club['category']
	name?: Club['name']
}

export type ListClubsResponse = {
	clubs: Club[]
	totalSize: number
}

export type GetClubRequest = {
	uuid: Club['uuid']
}

export type ListManageClubsResponse = {
	clubs: Club[]
	totalSize: number
}

export type ListClubRankingsRequest = {
	topK?: number
}

export type ListClubRankingsResponse = {
	rankings: ClubRanking[]
	totalSize: number
}

export type RequestClubmanagerRequest = {
	clubId?: Club['uuid']
	clubName?: Club['name']
}

export type ListSavedClubsResponse = {
	clubs: Club[]
	totalSize: number
}

export type CreateSavedClubRequest = {
	clubId: Club['uuid']
}

export type RemoveSavedClubRequest = {
	clubId: Club['uuid']
}

export type RegisterClubRequest = {
	club_data: {
		name: string
		type: string
		image_uri: string
		category: string
		affiliation: string
		short_description: string
		recruit_type: string
		min_activity_period: number
		has_dongbang: boolean
		dongbang_location?: string
		sns: string
		introduction: string
	}
	manager_data: {
		name: string
		phone: string
		student_id: string
	}
}

export type RegisterClubResponse = {
	success: boolean
	message: string
}

export type ListMyClubsResponse = {
	clubs: Club[]
	totalSize: number
}

export type ClubRepository = {
	searchClubs: (req: SearchClubsRequest) => Promise<SearchClubsResponse>
	listPopularClubs: () => Promise<ListPopularClubsResponse>
	listLatestClubs: () => Promise<ListLatestClubsResponse>
	listClubs: (req: ListClubsRequest) => Promise<ListClubsResponse>
	getClub: (req: GetClubRequest) => Promise<Club>
	listManageClubs: () => Promise<ListManageClubsResponse>
	listClubRankings: (req: ListClubRankingsRequest) => Promise<ListClubRankingsResponse>
	requestClubManager: (req: RequestClubmanagerRequest) => Promise<void>
	listSavedClubs: () => Promise<ListSavedClubsResponse>
	createSavedClub: (req: CreateSavedClubRequest) => Promise<void>
	removeSavedClub: (req: RemoveSavedClubRequest) => Promise<void>
	listMyClubs: () => Promise<ListMyClubsResponse>
	registerClub: (req: RegisterClubRequest) => Promise<RegisterClubResponse>
}

export const getClubRepository = (): ClubRepository => ({
	searchClubs: async req => {
		const response = await apiConnector.get<SearchClubsResponse>('/v1/clubs/search', {
			query: req.query.toLowerCase().trim(),
		})

		return response
	},
	listPopularClubs: async () => {
		const response = await apiConnector.get<ListPopularClubsResponse>('/v1/clubs/popular')

		return response
	},
	listLatestClubs: async () => {
		const response = await apiConnector.get<ListLatestClubsResponse>('/v1/clubs/latest')

		return response
	},
	listClubs: async req => {
		const response = await apiConnector.get<ListClubsResponse>('/v1/clubs', {
			...(req.category && { category: req.category }),
		})

		return response
	},
	getClub: async req => {
		const club = await apiConnector.get<Club>(`/v1/clubs/${req.uuid}`)

		if (!club) {
			throw new Error('Club not found')
		}
		return club
	},
	listManageClubs: async () => {
		const response = await apiConnector.get<ListManageClubsResponse>('/v1/managers/me/clubs')

		return response
	},
	listClubRankings: async req => {
		const response = await apiConnector.get<ListClubRankingsResponse>(
			`/v1/clubs/rankings?topk=${req.topK ?? 5}`,
		)

		return response
	},
	requestClubManager: async req => {
		await apiConnector.post<void>('/v1/managers/me/clubs', req)
	},
	listSavedClubs: async () => {
		const response = await apiConnector.get<ListSavedClubsResponse>('/v1/users/me/clubs/saved')

		return response
	},
	createSavedClub: async req => {
		await apiConnector.post<void>(`/v1/clubs/${req.clubId}/saved`)
	},
	removeSavedClub: async req => {
		await apiConnector.delete<void>(`/v1/clubs/${req.clubId}/saved`)
	},
	listMyClubs: async () => {
		const response = await apiConnector.get<ListMyClubsResponse>('/v1/users/me/clubs')

		return response
	},
	registerClub: async req => {
		const response = await apiConnector.post<RegisterClubResponse>(
			'/v2/clubs/register',
			req,
		)

		return response
	},
})
