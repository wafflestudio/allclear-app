import { useState } from 'react'
import { BlurView } from '@react-native-community/blur'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
	SearchFilterToggleGroup,
	type SearchFilterToggleGroupSelection,
} from '@/features/club/components/SearchFilterToggleGroup'
import { MinDurationToggle } from '@/features/club/components/MinDurationToggle/MinDurationToggle'
import type { MinDurationValue } from '@/features/club/components/MinDurationToggle/useMinDurationToggle'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s } from '@/shared/utils/scale'

type Props = {
	onClose: () => void
}

const RECRUITMENT_OPTIONS = [
	{ label: '정기모집', value: 'regular' },
	{ label: '상시모집', value: 'always' },
] as const

const FEE_OPTIONS = [
	{ label: '회비있음', value: 'hasFee' },
	{ label: '회비없음', value: 'noFee' },
] as const

const ROOM_OPTIONS = [
	{ label: '동방보유', value: 'hasRoom' },
	{ label: '동방없음', value: 'noRoom' },
] as const

const SearchFilterOverlay = ({ onClose }: Props) => {
	const [recruitmentSelection, setRecruitmentSelection] =
		useState<SearchFilterToggleGroupSelection>({ kind: 'none' })
	const [feeSelection, setFeeSelection] = useState<SearchFilterToggleGroupSelection>({
		kind: 'none',
	})
	const [roomSelection, setRoomSelection] = useState<SearchFilterToggleGroupSelection>({
		kind: 'none',
	})
	const [minDuration, setMinDuration] = useState<MinDurationValue>([])

	return (
		<View style={styles.wrapper}>
			<Pressable onPress={onClose} style={styles.dim}>
				<BlurView
					style={styles.blur}
					blurType="light"
					blurAmount={1}
					overlayColor="transparent"
					reducedTransparencyFallbackColor="transparent"
				/>
			</Pressable>
			<View style={styles.container}>
				<View style={styles.header}>
					<Text style={styles.text}>더 자세한 검색을 위해 상세필터를 설정해보세요!</Text>
					<Pressable
						hitSlop={8}
						onPress={() => {}}
						style={({ pressed }) => [styles.resetButton, pressed && styles.pressed]}>
						<Icon color={Colors.POINTCOLOR} name="reload" size={s(15)} />
					</Pressable>
				</View>
				<View style={styles.filters}>
					<View style={styles.toggleGroupContainer}>
						<View style={styles.filterRow}>
							<SearchFilterToggleGroup
								options={[...RECRUITMENT_OPTIONS]}
								selectionMode="single"
								value={recruitmentSelection}
								onChange={setRecruitmentSelection}
							/>
							<SearchFilterToggleGroup
								options={[...FEE_OPTIONS]}
								selectionMode="single"
								value={feeSelection}
								onChange={setFeeSelection}
							/>
						</View>
						<SearchFilterToggleGroup
							options={[...ROOM_OPTIONS]}
							selectionMode="single"
							value={roomSelection}
							onChange={setRoomSelection}
						/>
					</View>
					<MinDurationToggle value={minDuration} onChange={setMinDuration} />
				</View>
			</View>
		</View>
	)
}

export default SearchFilterOverlay

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		position: 'relative',
		width: '100%',
	},
	dim: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: Colors.BACKGROUND_DIM,
	},
	blur: {
		...StyleSheet.absoluteFillObject,
	},
	container: {
		backgroundColor: Colors.BACKGROUND_MAIN,
		borderBottomLeftRadius: s(15),
		borderBottomRightRadius: s(15),
		paddingTop: s(27),
		paddingRight: s(20),
		paddingBottom: s(31),
		paddingLeft: s(34),
		gap: s(18),
		zIndex: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	filters: {
		gap: s(20),
	},
	toggleGroupContainer: {
		gap: s(10),
	},
	filterRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		gap: s(15),
	},
	text: {
		...typography.bodySRegular,
		color: Colors.BODYTEXT_SUB,
		flex: 1,
	},
	resetButton: {
		marginLeft: s(16),
		alignItems: 'center',
		justifyContent: 'center',
	},
	pressed: {
		opacity: 0.65,
	},
})
