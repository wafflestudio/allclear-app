import AsyncStorage from '@react-native-async-storage/async-storage'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Colors } from '@/shared/constants/colors'
import { useProfile } from '@/shared/contexts/profileContext'
import { serviceContext } from '@/shared/contexts/serviceContext'
import dayjs from 'dayjs'
import { Club } from '@/entities/club'
import React, { useContext, useEffect } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { requestReview } from 'react-native-store-review'
import Toast from 'react-native-toast-message'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { REVIEW_LAST_ASKED_KEY } from '@/shared/constants/localStorage'

const getLastAskedDate = async (): Promise<dayjs.Dayjs | null> => {
	try {
		const value = await AsyncStorage.getItem(REVIEW_LAST_ASKED_KEY)
		return value !== null ? dayjs(JSON.parse(value)) : null
	} catch (e) {
		console.error('Failed to load last asked date.', e)
		return null
	}
}

const setLastAskedDate = async (date: dayjs.Dayjs): Promise<void> => {
	try {
		await AsyncStorage.setItem(REVIEW_LAST_ASKED_KEY, JSON.stringify(date.toISOString()))
	} catch (e) {
		console.error('Failed to save last asked date.', e)
	}
}

type Props = {
	club?: Club
	onBack: () => void
}

const Header = ({ club, onBack }: Props) => {
	const queryClient = useQueryClient()
	const { clubService } = useContext(serviceContext)
	const { data: savedClubs } = useSavedClubs()

	const [isSaved, setIsSaved] = React.useState(false)
	const [shouldShowReview, setShouldShowReview] = React.useState(false)

	useEffect(() => {
		setIsSaved(!!savedClubs?.some(savedClub => savedClub.uuid === club?.uuid))
	}, [savedClubs, club])

	useEffect(() => {
		const checkReviewStatus = async () => {
			const lastAskedDate = await getLastAskedDate()

			if (!lastAskedDate) {
				setShouldShowReview(true)
				return
			} else if (dayjs().isAfter(lastAskedDate.add(3, 'month'))) {
				setShouldShowReview(true)
				return
			}
		}

		checkReviewStatus()
	}, [])

	const handleBack = async () => {
		if (shouldShowReview) {
			try {
				setShouldShowReview(false)
				await Promise.all([requestReview(), setLastAskedDate(dayjs())])
			} catch (error) {
				console.error('Review request failed', error)
			}
		}
		onBack()
	}

	const handleCreateSavedClub = async () => {
		if (!club) return

		try {
			setIsSaved(true)
			await clubService.createSavedClub({ clubId: club.uuid })
			Toast.show({
				type: 'info',
				text1: '동아리가 저장되었어요!',
				position: 'bottom',
				visibilityTime: 2000,
			})
			queryClient.invalidateQueries()
		} catch (error) {
			setIsSaved(false)
			Toast.show({
				type: 'info',
				text1: '이런! 문제가 생겼어요!',
				position: 'bottom',
				visibilityTime: 2000,
			})
		}
	}

	const handleRemoveSavedClub = async () => {
		if (!club) return

		try {
			setIsSaved(false)
			await clubService.removeSavedClub({ clubId: club.uuid })
			queryClient.invalidateQueries()
		} catch (error) {
			setIsSaved(true)
			Toast.show({
				type: 'info',
				text1: '이런! 문제가 생겼어요!',
				position: 'bottom',
				visibilityTime: 2000,
			})
		}
	}

	return (
		<View
			style={{
				position: 'relative',
				padding: 20,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'flex-start',
				justifyContent: 'space-between',
				zIndex: 3,
			}}>
			<TouchableOpacity onPress={handleBack}>
				<Icon color={'#FFFFFF' /* #deprecated color */} name="chevron-left" size={24} />
			</TouchableOpacity>
			{isSaved ? (
				<TouchableOpacity onPress={handleRemoveSavedClub}>
					<Icon color={'#FFFFFF' /* #deprecated color */} name="heart" size={24} />
				</TouchableOpacity>
			) : (
				<TouchableOpacity onPress={handleCreateSavedClub}>
					<Icon color={'#FFFFFF' /* #deprecated color */} name="heart-outline" size={24} />
				</TouchableOpacity>
			)}
		</View>
	)
}

export default Header

const useSavedClubs = () => {
	const { user } = useProfile()
	const { clubService } = useContext(serviceContext)

	const query = useQuery(['savedClubs'], () => clubService.listSavedClubs(), {
		select: data => data.clubs,
		enabled: !!user,
	})

	return query
}
