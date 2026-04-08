import WithViewEventLog from 'shared/hocs/WithViewEventLog'
import React from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import RankedClubs from './RankedClubs'

const ClubRankingScreen = () => {
	return (
		<WithViewEventLog params={{ screen_name: 'club_review_screen' }}>
			<SafeAreaView
				edges={['top', 'left', 'right']}
				style={{
					flex: 1,
					padding: 0,
					backgroundColor: '#F5F4F0',
				}}>
				<ScrollView>
					<RankedClubs />
				</ScrollView>
			</SafeAreaView>
		</WithViewEventLog>
	)
}

export default ClubRankingScreen
