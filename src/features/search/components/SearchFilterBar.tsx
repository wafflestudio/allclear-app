import { Pressable, StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import type { ClubSearchFilters } from '@/features/search/types/clubSearchForm'
import Checkbox from '@/shared/components/Checkbox'
import { Colors } from '@/shared/constants/colors'
import { s } from '@/shared/utils/scale'
import {
	SearchFilterToggleGroup,
	type SearchFilterToggleGroupSelection,
} from '@/features/club/components/SearchFilterToggleGroup'

const CLUB_TYPE_OPTIONS = [
	{ label: '중앙동아리', value: '중앙동아리' },
	{ label: '학과/단과대동아리', value: '학과/단과대동아리' },
] as const

type Props = {
	filters: ClubSearchFilters
	onChange: (value: ClubSearchFilters) => void
	onPressFilter: () => void
}

const SearchFilterBar = ({ filters, onChange, onPressFilter }: Props) => {
	const clubTypeSelection =
		filters.affiliation_type === '전체'
			? { kind: 'all' as const }
			: { kind: 'values' as const, values: [filters.affiliation_type] }

	const handleChangeAffiliationType = (selection: SearchFilterToggleGroupSelection) => {
		if (selection.kind !== 'values') {
			onChange({
				...filters,
				affiliation_type: '전체',
			})
			return
		}

		const nextAffiliationType = selection.values[0] as
			| ClubSearchFilters['affiliation_type']
			| undefined

		onChange({
			...filters,
			affiliation_type: nextAffiliationType ?? '전체',
		})
	}

	const handleToggleRecruiting = () => {
		onChange({
			...filters,
			is_recruiting: filters.is_recruiting === 'true' ? undefined : 'true',
		})
	}

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
					selectionMode="single"
					value={clubTypeSelection}
					onChange={handleChangeAffiliationType}
					style={styles.toggleGroup}
					itemStyle={styles.toggleItem}
				/>
			</View>
			<View>
				<Checkbox
					label="현재 모집중"
					checked={filters.is_recruiting === 'true'}
					onPressIn={handleToggleRecruiting}
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
