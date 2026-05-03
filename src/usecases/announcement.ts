import { AnnouncementRepository, ListAnnouncementsResponse } from '@/repositories/announcement'

export type AnnouncementService = {
	listAnnouncements: () => Promise<ListAnnouncementsResponse>
}

type Deps = {
	repositories: [AnnouncementRepository]
}

export const getAnnouncementService = ({ repositories }: Deps): AnnouncementService => ({
	listAnnouncements: repositories[0].listAnnouncements,
})
