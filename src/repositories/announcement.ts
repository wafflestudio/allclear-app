import { Announcement } from '@/entities/announcement'
import { apiConnector } from '@/shared/utils/api'

export type ListAnnouncementsResponse = {
	data: Announcement[]
}

export type AnnouncementRepository = {
	listAnnouncements: () => Promise<ListAnnouncementsResponse>
}

export const getAnnouncementRepository = (): AnnouncementRepository => ({
	listAnnouncements: async () => {
		const response = await apiConnector.get<ListAnnouncementsResponse>('/v1/announcements')

		return response
	},
})
