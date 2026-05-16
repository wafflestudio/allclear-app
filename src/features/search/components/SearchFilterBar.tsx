import { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Checkbox from '@/shared/components/Checkbox'
import { Colors } from '@/shared/constants/colors'
import { s } from '@/shared/utils/scale'
import {
	SearchFilterToggleGroup,
	type SearchFilterToggleGroupSelection,
} from '@/features/club/components/SearchFilterToggleGroup'

const CLUB_TYPE_OPTIONS = [
	{ label: '중앙동아리', value: 'central' },
	{ label: '학과/단과대동아리', value: 'department' },
] as const

type Props = {
	onPressFilter: () => void
}

const SearchFilterBar = ({ onPressFilter }: Props) => {
	const [clubTypeSelection, setClubTypeSelection] = useState<SearchFilterToggleGroupSelection>({
		kind: 'all',
	})
	const [isRecruiting, setIsRecruiting] = useState(false)

	return (
		<View style={styles.container}>
			<Pressable
				hitSlop={8}
				onPress={onPressFilter}
				style={({ pressed }) => [styles.filterIconContainer, pressed && styles.pressed]}>
				<Icon color={Colors.POINTCOLOR} name="tune" size={s(15)} />
			</Pressable>
			<View>
				<SearchFilterToggleGroup
					options={[...CLUB_TYPE_OPTIONS]}
					allItem={{ label: '전체' }}
					selectionMode="multiple"
					value={clubTypeSelection}
					onChange={setClubTypeSelection}
					style={styles.toggleGroup}
					itemStyle={styles.toggleItem}
				/>
			</View>
			<View>
				<Checkbox
					label="현재 모집중"
					checked={isRecruiting}
					onPressIn={() => setIsRecruiting(prev => !prev)}
				/>
			</View>
		</View>
	)
}

export default SearchFilterBar

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	filterIconContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	pressed: {
		opacity: 0.65,
	},
	toggleGroup: {
		flexWrap: 'nowrap',
		gap: s(5),
	},
	toggleItem: {
		paddingHorizontal: s(13),
	},
})
