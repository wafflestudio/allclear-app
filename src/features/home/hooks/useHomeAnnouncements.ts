import { useIsFocused } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Announcement } from '@/entities/announcement'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { useContext, useEffect, useState } from 'react'
import { getAnnouncementsQueryOptions } from '@/features/home/utils/announcementQueries'

type HomeAnnouncementModalItem = {
	key: string
	uuid: string
	title: string
	description: string
}

let hasShownAnnouncementsThisSession = false

const useHomeAnnouncements = () => {
	const { announcementService } = useContext(serviceContext)
	const isFocused = useIsFocused()
	const [modalQueue, setModalQueue] = useState<HomeAnnouncementModalItem[]>([])
	const { data: announcements = [], isSuccess: hasLoadedAnnouncements } = useQuery(
		getAnnouncementsQueryOptions(announcementService),
	)

	useEffect(() => {
		if (!isFocused) return
		if (!hasLoadedAnnouncements) return
		if (hasShownAnnouncementsThisSession) return

		setModalQueue(announcements.map(createAnnouncementModalItem))
		hasShownAnnouncementsThisSession = true
	}, [announcements, hasLoadedAnnouncements, isFocused])

	const handleCloseAnnouncement = () => {
		setModalQueue(prev => prev.slice(1))
	}

	const handleHideAnnouncement = () => {
		setModalQueue(prev => prev.slice(1))
	}

	return {
		currentAnnouncement: modalQueue[0],
		handleCloseAnnouncement,
		handleHideAnnouncement,
	}
}

export default useHomeAnnouncements

const createAnnouncementModalItem = (announcement: Announcement): HomeAnnouncementModalItem => ({
	key: `announcement-${announcement.uuid}`,
	uuid: announcement.uuid,
	title: announcement.title,
	description: announcement.content,
})
