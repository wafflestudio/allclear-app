import { AnnouncementService } from '@/usecases/announcement'

export const announcementQueryKey = ['announcements'] as const

export const getAnnouncementsQueryOptions = (announcementService: AnnouncementService) => ({
	queryKey: announcementQueryKey,
	queryFn: () => announcementService.listAnnouncements(),
	select: (data: Awaited<ReturnType<AnnouncementService['listAnnouncements']>>) => data.data,
	staleTime: 60 * 1000,
})
