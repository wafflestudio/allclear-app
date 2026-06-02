import { useQuery } from '@tanstack/react-query'
import { Colors } from '@/shared/constants/colors'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { Club } from '@/entities/club'
import { SCREEN_TYPE } from '@/shared/constants/screen'
import WithViewEventLog from '@/shared/hocs/WithViewEventLog'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { navigation } from '@/shared/utils/navigation'
import ClubList from '@/features/club/components/ClubList/ClubList'
import Header from '@/shared/components/BackHeader'

const SavedClubListScreen = () => {
	const { data: savedClubs, isLoading } = useSavedClubs()

	const openDetailPage = (club: Club) => {
		navigation.navigate(SCREEN_TYPE.CLUB_DETAIL, {
			uuid: club.uuid,
			category: club.category,
			entry_point: 'saved_club_list',
		})
	}

	const handleBack = () => {
		navigation.goBack()
	}

	return (
		<WithViewEventLog
			params={{
				screen_name: 'saved_club_list_screen',
			}}>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={{ flex: 1, backgroundColor: Colors.BACKGROUND_MAIN, overflow: 'scroll' }}>
				<Header title="저장한 동아리" onBack={handleBack} />
				<ClubList
					clubs={savedClubs}
					openDetailPage={openDetailPage}
					emptyPlaceholder="저장한 동아리가 없어요"
					isLoading={isLoading}
				/>
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default SavedClubListScreen

const useSavedClubs = () => {
	const { clubService } = useContext(serviceContext)

	return useQuery(['savedClubs'], () => clubService.listSavedClubs(), {
		// 저장 목록의 동아리는 정의상 모두 저장 상태이므로 하트가 항상 채워지도록 보정
		select: data => data.clubs.map(club => ({ ...club, isSaved: true })),
	})
}
