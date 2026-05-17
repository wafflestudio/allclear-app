import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Colors } from '@/shared/constants/colors'
import { ms, s, vs } from '@/shared/utils/scale'

export type AffiliationFilter = 'all' | 'central' | 'college'

type Props = {
	selectedFilter: AffiliationFilter
	isRecruitingOnly: boolean
	onChangeFilter: (filter: AffiliationFilter) => void
	onToggleRecruitingOnly: () => void
}

const FILTERS: { label: string; value: AffiliationFilter }[] = [
	{ label: '전체', value: 'all' },
	{ label: '중앙동아리', value: 'central' },
	{ label: '학과/단과대동아리', value: 'college' },
]

const SearchFilterBar = ({
	selectedFilter,
	isRecruitingOnly,
	onChangeFilter,
	onToggleRecruitingOnly,
}: Props) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			style={styles.container}
			contentContainerStyle={styles.scrollContent}>
			<Pressable hitSlop={8} style={styles.filterIconButton}>
				<Icon name="tune-variant" size={ms(16)} color={Colors.BODYTEXT_SUB} />
			</Pressable>
			<View style={styles.chipGroup}>
				{FILTERS.map(filter => {
					const selected = selectedFilter === filter.value
					return (
						<Pressable
							key={filter.value}
							onPress={() => onChangeFilter(filter.value)}
							style={[styles.chip, selected ? styles.selectedChip : styles.unselectedChip]}>
							<Text
								style={[
									styles.chipText,
									selected ? styles.selectedChipText : styles.unselectedChipText,
								]}>
								{filter.label}
							</Text>
						</Pressable>
					)
				})}
			</View>
			<Pressable
				style={styles.recruitingFilter}
				onPress={onToggleRecruitingOnly}
				hitSlop={8}>
				<View style={[styles.checkbox, isRecruitingOnly && styles.checkboxSelected]}>
					{isRecruitingOnly ? <Icon name="check" size={ms(10)} color={Colors.WHITE} /> : null}
				</View>
				<Text style={styles.recruitingText}>현재 모집중</Text>
			</Pressable>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		flexGrow: 0,
	},
	scrollContent: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(12),
	},
	filterIconButton: {
		width: ms(15),
		height: ms(28),
		alignItems: 'center',
		justifyContent: 'center',
	},
	chipGroup: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(5),
		flexShrink: 1,
	},
	chip: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: s(13),
		paddingVertical: vs(7),
		borderRadius: ms(15),
		borderWidth: 0.65,
	},
	selectedChip: {
		backgroundColor: Colors.POINTCOLOR,
		borderColor: Colors.POINTCOLOR,
		borderRadius: ms(20),
	},
	unselectedChip: {
		backgroundColor: 'transparent',
		borderColor: '#CBCBCB',
	},
	chipText: {
		fontSize: ms(11),
		lineHeight: vs(14),
		fontFamily: 'Pretendard-Medium',
	},
	selectedChipText: {
		color: Colors.WHITE,
		fontFamily: 'Pretendard-SemiBold',
	},
	unselectedChipText: {
		color: '#CBCBCB',
	},
	recruitingFilter: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: s(4),
		flexShrink: 0,
	},
	checkbox: {
		width: ms(14),
		height: ms(14),
		borderRadius: ms(2),
		borderWidth: 1,
		borderColor: Colors.POINTCOLOR,
		alignItems: 'center',
		justifyContent: 'center',
	},
	checkboxSelected: {
		backgroundColor: Colors.POINTCOLOR,
	},
	recruitingText: {
		fontSize: ms(12),
		lineHeight: vs(14),
		fontFamily: 'Pretendard-SemiBold',
		color: Colors.POINTCOLOR,
	},
})

export default SearchFilterBar
