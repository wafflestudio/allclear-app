import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { SCREEN_TYPE, StackParamList } from '@/shared/constants/screen'
import React, { useRef, useState } from 'react'
import {
	Image,
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { launchImageLibrary } from 'react-native-image-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'

// ─── Constants ───────────────────────────────────────────────────────────────

const PRIMARY = '#874fff'
const BORDER = '#c1c1c1'
const HELPER_COLOR = '#874fff'
const PLACEHOLDER_COLOR = '#c1c1c1'
const BG = '#ffffff'

const YEARS = Array.from({ length: 8 }, (_, i) => String(new Date().getFullYear() + 2 - i))
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const DAYS_OF_WEEK = ['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일']
const MEETING_TIMES = Array.from({ length: 48 }, (_, i) => {
	const h = Math.floor(i / 2)
		.toString()
		.padStart(2, '0')
	const m = i % 2 === 0 ? '00' : '30'
	return `${h}:${m}`
})

// ─── Types ────────────────────────────────────────────────────────────────────

type NavigationProp = NativeStackNavigationProp<
	StackParamList,
	SCREEN_TYPE.ANNOUNCEMENT_REGISTRATION
>

type Props = {
	navigation: NavigationProp
}

type RegularMeeting = {
	id: number
	day: string
	startTime: string
	endTime: string
}

// ─── CustomDropdown ───────────────────────────────────────────────────────────

type DropdownProps = {
	value: string
	options: string[]
	onChange: (val: string) => void
	width?: number
}

const CustomDropdown = ({ value, options, onChange, width }: DropdownProps) => {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ x: 0, y: 0, w: 0 })
	const btnRef = useRef<View>(null)

	const handleOpen = () => {
		btnRef.current?.measureInWindow((x, y, w, h) => {
			setPos({ x, y: y + h, w: width ?? w })
			setOpen(true)
		})
	}

	return (
		<View style={{ width }} ref={btnRef}>
			<TouchableOpacity style={[styles.dropdown, open && styles.dropdownOpen]} onPress={handleOpen}>
				<Text style={[styles.dropdownText, open && { color: PRIMARY }]}>{value}</Text>
				<Icon
					name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
					size={16}
					color={open ? PRIMARY : BORDER}
				/>
			</TouchableOpacity>

			<Modal visible={open} transparent animationType="none">
				<View
					style={StyleSheet.absoluteFill}
					onStartShouldSetResponder={() => true}
					onResponderGrant={() => setOpen(false)}>
					<View
						style={[
							styles.dropdownList,
							styles.dropdownListOpen,
							{ position: 'absolute', top: pos.y, left: pos.x, width: pos.w },
						]}
						onStartShouldSetResponder={() => true}
						onResponderGrant={() => {}}>
						<ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 220 }}>
							{options.map(opt => (
								<TouchableOpacity
									key={opt}
									style={[styles.dropdownItem, opt === value && styles.dropdownItemSelected]}
									onPress={() => {
										onChange(opt)
										setOpen(false)
									}}>
									<Text
										style={[
											styles.dropdownItemText,
											opt === value && styles.dropdownItemTextSelected,
										]}>
										{opt}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
					</View>
				</View>
			</Modal>
		</View>
	)
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────

type ConfirmModalProps = {
	visible: boolean
	onCancel: () => void
	onConfirm: () => void
}

const ConfirmModal = ({ visible, onCancel, onConfirm }: ConfirmModalProps) => (
	<Modal visible={visible} transparent animationType="fade">
		<View style={styles.confirmOverlay}>
			<View style={styles.confirmBox}>
				<Text style={[styles.confirmTitle, { marginBottom: 12 }]}>공고를 등록할까요?</Text>
				<Text style={[styles.confirmDesc, { marginBottom: 20 }]}>
					{'공고는 언제든 참여하여 한번 + 공고 신규 입력에\n수정하는 것도 가능해요'}
				</Text>
				<View style={styles.confirmButtons}>
					<TouchableOpacity style={styles.confirmCancel} onPress={onCancel}>
						<Text style={styles.confirmCancelText}>취소</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.confirmSubmit} onPress={onConfirm}>
						<Text style={styles.confirmSubmitText}>등록</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	</Modal>
)

// ─── SuccessModal ─────────────────────────────────────────────────────────────

type SuccessModalProps = {
	visible: boolean
	onConfirm: () => void
}

const SuccessModal = ({ visible, onConfirm }: SuccessModalProps) => (
	<Modal visible={visible} transparent animationType="fade">
		<View style={styles.confirmOverlay}>
			<View style={styles.confirmBox}>
				<Text style={[styles.confirmTitle, { marginBottom: 20 }]}>
					{'공고 등록이 정상적으로\n완료되었어요!'}
				</Text>
				<TouchableOpacity
					style={[styles.confirmSubmit, { alignSelf: 'stretch', flex: 0 }]}
					onPress={onConfirm}>
					<Text style={styles.confirmSubmitText}>확인</Text>
				</TouchableOpacity>
			</View>
		</View>
	</Modal>
)

// ─── Main Screen ──────────────────────────────────────────────────────────────

const AnnouncementRegistrationScreen = ({ navigation }: Props) => {
	// 공고 제목
	const [title, setTitle] = useState('')

	// 모집 기간
	const [year, setYear] = useState(String(new Date().getFullYear()))
	const [month, setMonth] = useState(String(new Date().getMonth() + 1).padStart(2, '0'))
	const [day, setDay] = useState(String(new Date().getDate()).padStart(2, '0'))
	const [hour, setHour] = useState('23')
	const [minute, setMinute] = useState('59')

	// 필참 활동 여부
	const [hasRequiredActivity, setHasRequiredActivity] = useState<boolean | null>(null)

	// 정기 모임 일시
	const [hasRegularMeeting, setHasRegularMeeting] = useState<boolean | null>(null)
	const [regularMeetings, setRegularMeetings] = useState<RegularMeeting[]>([
		{ id: 1, day: '월요일', startTime: '09:00', endTime: '10:00' },
	])

	// 활동 장소
	const [activityLocation, setActivityLocation] = useState<'동방' | '동방 외' | '미정' | null>(null)
	const [locationText, setLocationText] = useState('')

	// 지원 자격
	const [qualification, setQualification] = useState<'제한 없음' | '제한 있음' | null>(null)
	const [qualificationText, setQualificationText] = useState('')

	// 모집 인원
	const [recruitCount, setRecruitCount] = useState<'제한 없음' | '정원 있음' | null>(null)
	const [recruitCountText, setRecruitCountText] = useState('')

	// 회비
	const [hasFee, setHasFee] = useState<boolean | null>(null)
	const [feeText, setFeeText] = useState('')

	// 가입 절차
	const [joinUrl, setJoinUrl] = useState('')
	const [joinDescription, setJoinDescription] = useState('')

	// 기존 공고
	const [existingAnnouncement, setExistingAnnouncement] = useState('')

	// 공고 이미지
	const [images, setImages] = useState<string[]>([])

	const handleAddImage = () => {
		launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, response => {
			if (response.assets?.[0]?.uri) {
				setImages(prev => [...prev, response.assets![0].uri!])
			}
		})
	}

	const handleRemoveImage = (index: number) => {
		setImages(prev => prev.filter((_, i) => i !== index))
	}

	// 모달
	const [showConfirm, setShowConfirm] = useState(false)
	const [showSuccess, setShowSuccess] = useState(false)

	// 정기 모임 관리
	const addRegularMeeting = () => {
		setRegularMeetings(prev => [
			...prev,
			{ id: Date.now(), day: '월요일', startTime: '09:00', endTime: '10:00' },
		])
	}

	const removeRegularMeeting = (id: number) => {
		setRegularMeetings(prev => prev.filter(m => m.id !== id))
	}

	const updateRegularMeeting = (id: number, field: keyof RegularMeeting, value: string) => {
		setRegularMeetings(prev => prev.map(m => (m.id === id ? { ...m, [field]: value } : m)))
	}

	const handleSubmit = () => {
		setShowConfirm(true)
	}

	const handleConfirm = () => {
		setShowConfirm(false)
		setShowSuccess(true)
	}

	const handleSuccessConfirm = () => {
		setShowSuccess(false)
		navigation.goBack()
	}

	return (
		<SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps="handled">
				{/* 헤더 */}
				<Text style={styles.screenTitle}>모집 공고를 작성해주세요</Text>
				<TouchableOpacity style={styles.loadPreviousButton}>
					<Text style={styles.loadPreviousText}>이전 공고 불러오기</Text>
				</TouchableOpacity>

				{/* 공고 제목 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*공고 제목</Text>
					<TextInput
						style={styles.textInput}
						placeholder="텍스트를 입력하세요"
						placeholderTextColor={PLACEHOLDER_COLOR}
						value={title}
						onChangeText={setTitle}
					/>
					<Text style={styles.helperText}>공고 제목은 필수 입력 정보예요</Text>
				</View>

				{/* 모집 기간 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*모집 기간</Text>
					<View style={styles.dateRow}>
						<CustomDropdown value={year} options={YEARS} onChange={setYear} width={88} />
						<Text style={styles.dateUnitLabel}>년</Text>
						<CustomDropdown value={month} options={MONTHS} onChange={setMonth} width={68} />
						<Text style={styles.dateUnitLabel}>월</Text>
						<CustomDropdown value={day} options={DAYS} onChange={setDay} width={68} />
						<Text style={styles.dateUnitLabel}>일</Text>
					</View>
					<View style={[styles.dateRow, { marginTop: 8 }]}>
						<CustomDropdown value={hour} options={HOURS} onChange={setHour} width={68} />
						<Text style={styles.dateUnitLabel}>시</Text>
						<CustomDropdown value={minute} options={MINUTES} onChange={setMinute} width={68} />
						<Text style={styles.dateUnitLabel}>분</Text>
						<Text style={styles.deadlineLabel}>모집 마감</Text>
					</View>
				</View>

				{/* 필참 활동 여부 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*필참 활동 여부</Text>
					<View style={styles.toggleRow}>
						<TouchableOpacity
							style={[styles.toggleButton, hasRequiredActivity === true && styles.toggleButtonOn]}
							onPress={() => setHasRequiredActivity(true)}>
							<Text
								style={[styles.toggleText, hasRequiredActivity === true && styles.toggleTextOn]}>
								있음
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.toggleButton, hasRequiredActivity === false && styles.toggleButtonOn]}
							onPress={() => setHasRequiredActivity(false)}>
							<Text
								style={[styles.toggleText, hasRequiredActivity === false && styles.toggleTextOn]}>
								없음
							</Text>
						</TouchableOpacity>
					</View>
					<Text style={styles.helperText}>필참 활동 여부는 필수 입력 정보예요</Text>
				</View>

				{/* 정기 모임 일시 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*정기 모임 일시</Text>
					<View style={styles.toggleRow}>
						<TouchableOpacity
							style={[styles.toggleButton, hasRegularMeeting === true && styles.toggleButtonOn]}
							onPress={() => setHasRegularMeeting(true)}>
							<Text style={[styles.toggleText, hasRegularMeeting === true && styles.toggleTextOn]}>
								정기 모임 있음
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.toggleButton, hasRegularMeeting === false && styles.toggleButtonOn]}
							onPress={() => setHasRegularMeeting(false)}>
							<Text style={[styles.toggleText, hasRegularMeeting === false && styles.toggleTextOn]}>
								정기 모임 없음
							</Text>
						</TouchableOpacity>
					</View>

					{hasRegularMeeting === true && (
						<>
							{regularMeetings.map(meeting => (
								<View key={meeting.id} style={styles.meetingRow}>
									<CustomDropdown
										value={meeting.day}
										options={DAYS_OF_WEEK}
										onChange={v => updateRegularMeeting(meeting.id, 'day', v)}
										width={92}
									/>
									<CustomDropdown
										value={meeting.startTime}
										options={MEETING_TIMES}
										onChange={v => updateRegularMeeting(meeting.id, 'startTime', v)}
										width={76}
									/>
									<Text style={styles.tilde}>~</Text>
									<CustomDropdown
										value={meeting.endTime}
										options={MEETING_TIMES}
										onChange={v => updateRegularMeeting(meeting.id, 'endTime', v)}
										width={76}
									/>
									<TouchableOpacity onPress={() => removeRegularMeeting(meeting.id)}>
										<Icon name="delete-outline" size={20} color="#999" />
									</TouchableOpacity>
								</View>
							))}
							<TouchableOpacity style={styles.addTimeButton} onPress={addRegularMeeting}>
								<Text style={styles.addTimeText}>+ 시간 추가</Text>
							</TouchableOpacity>
						</>
					)}
					<Text style={styles.helperText}>정기 모임 유무는 필수 입력 정보예요</Text>
				</View>

				{/* 활동 장소 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*활동 장소</Text>
					<View style={styles.toggleRow}>
						{(['동방', '동방 외', '미정'] as const).map(option => (
							<TouchableOpacity
								key={option}
								style={[styles.toggleButton, activityLocation === option && styles.toggleButtonOn]}
								onPress={() => setActivityLocation(option)}>
								<Text
									style={[styles.toggleText, activityLocation === option && styles.toggleTextOn]}>
									{option}
								</Text>
							</TouchableOpacity>
						))}
					</View>
					{activityLocation === '동방 외' && (
						<View style={styles.iconInputWrapper}>
							<Icon name="place" size={16} color="#999" style={{ marginRight: 6 }} />
							<TextInput
								style={styles.iconInput}
								placeholder="장소를 입력하세요"
								placeholderTextColor={PLACEHOLDER_COLOR}
								value={locationText}
								onChangeText={setLocationText}
							/>
						</View>
					)}
					<Text style={styles.helperText}>활동 장소는 필수 입력 정보예요</Text>
				</View>

				{/* 지원 자격 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*지원 자격</Text>
					<View style={styles.toggleRow}>
						<TouchableOpacity
							style={[styles.toggleButton, qualification === '제한 없음' && styles.toggleButtonOn]}
							onPress={() => setQualification('제한 없음')}>
							<Text
								style={[styles.toggleText, qualification === '제한 없음' && styles.toggleTextOn]}>
								제한 없음
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.toggleButton, qualification === '제한 있음' && styles.toggleButtonOn]}
							onPress={() => setQualification('제한 있음')}>
							<Text
								style={[styles.toggleText, qualification === '제한 있음' && styles.toggleTextOn]}>
								제한 있음
							</Text>
						</TouchableOpacity>
					</View>
					{qualification === '제한 있음' && (
						<TextInput
							style={[styles.textInput, { marginTop: 8 }]}
							placeholder="지원 자격에 대해 설명해주세요"
							placeholderTextColor={PLACEHOLDER_COLOR}
							value={qualificationText}
							onChangeText={setQualificationText}
							multiline
						/>
					)}
					<Text style={styles.helperText}>지원 자격은 필수 입력 정보예요</Text>
				</View>

				{/* 모집 인원 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*모집 인원</Text>
					<View style={styles.toggleRow}>
						<TouchableOpacity
							style={[styles.toggleButton, recruitCount === '제한 없음' && styles.toggleButtonOn]}
							onPress={() => setRecruitCount('제한 없음')}>
							<Text
								style={[styles.toggleText, recruitCount === '제한 없음' && styles.toggleTextOn]}>
								제한 없음
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.toggleButton, recruitCount === '정원 있음' && styles.toggleButtonOn]}
							onPress={() => setRecruitCount('정원 있음')}>
							<Text
								style={[styles.toggleText, recruitCount === '정원 있음' && styles.toggleTextOn]}>
								정원 있음
							</Text>
						</TouchableOpacity>
					</View>
					{recruitCount === '정원 있음' && (
						<TextInput
							style={[styles.textInput, { marginTop: 8 }]}
							placeholder="모집 인원에 대해 설명해주세요"
							placeholderTextColor={PLACEHOLDER_COLOR}
							value={recruitCountText}
							onChangeText={setRecruitCountText}
							multiline
						/>
					)}
					<Text style={styles.helperText}>모집 예정 인원은 필수 입력 정보예요</Text>
				</View>

				{/* 회비 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*회비</Text>
					<View style={styles.toggleRow}>
						<TouchableOpacity
							style={[styles.toggleButton, hasFee === true && styles.toggleButtonOn]}
							onPress={() => setHasFee(true)}>
							<Text style={[styles.toggleText, hasFee === true && styles.toggleTextOn]}>
								회비 O
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.toggleButton, hasFee === false && styles.toggleButtonOn]}
							onPress={() => setHasFee(false)}>
							<Text style={[styles.toggleText, hasFee === false && styles.toggleTextOn]}>
								회비 X
							</Text>
						</TouchableOpacity>
					</View>
					{hasFee === true && (
						<TextInput
							style={[styles.textInput, { marginTop: 8 }]}
							placeholder="회비에 관련해 자세히 설명해주세요"
							placeholderTextColor={PLACEHOLDER_COLOR}
							value={feeText}
							onChangeText={setFeeText}
							multiline
						/>
					)}
					<Text style={styles.helperText}>회비 유무는 필수 제공 정보예요</Text>
				</View>

				{/* 가입 절차 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>*가입 절차</Text>
					<View style={styles.iconInputWrapper}>
						<Icon name="link" size={16} color="#999" style={{ marginRight: 6 }} />
						<TextInput
							style={styles.iconInput}
							placeholder="지원 사이트의 url을 입력하세요"
							placeholderTextColor={PLACEHOLDER_COLOR}
							value={joinUrl}
							onChangeText={setJoinUrl}
							keyboardType="url"
							autoCapitalize="none"
						/>
					</View>
					<TextInput
						style={[styles.textInput, { marginTop: 8 }]}
						placeholder="동아리 가입 절차에 대해 설명해주세요"
						placeholderTextColor={PLACEHOLDER_COLOR}
						value={joinDescription}
						onChangeText={setJoinDescription}
						multiline
					/>
					<Text style={styles.helperText}>동아리 가입 절차는 필수 입력 정보예요</Text>
				</View>

				{/* 기존 공고 */}
				<View style={styles.section}>
					<Text style={styles.sectionLabel}>기존 공고</Text>
					<TextInput
						style={[styles.textInput, { minHeight: 80 }]}
						placeholder="기존에 작성해 둔 공고문을 붙여넣어주세요"
						placeholderTextColor={PLACEHOLDER_COLOR}
						value={existingAnnouncement}
						onChangeText={setExistingAnnouncement}
						multiline
						textAlignVertical="top"
					/>
				</View>

				{/* 공고 이미지 */}
				<View style={[styles.section, { marginBottom: 40 }]}>
					<Text style={styles.sectionLabel}>공고 이미지</Text>
					<View style={styles.imageRow}>
						{images.map((uri, idx) => (
							<View key={idx} style={styles.imageThumbnail}>
								<Image source={{ uri }} style={styles.thumbnailImg} />
								<TouchableOpacity
									style={styles.deleteImageBtn}
									onPress={() => handleRemoveImage(idx)}>
									<Icon name="close" size={14} color="#fff" />
								</TouchableOpacity>
							</View>
						))}
						<TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
							<Icon name="add" size={24} color={BORDER} />
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>

			{/* 하단 버튼 */}
			<View style={styles.bottomBar}>
				<TouchableOpacity style={styles.prevButton} onPress={() => navigation.goBack()}>
					<Text style={styles.prevButtonText}>이전</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
					<Text style={styles.submitButtonText}>완료</Text>
				</TouchableOpacity>
			</View>

			{/* 등록 확인 모달 */}
			<ConfirmModal
				visible={showConfirm}
				onCancel={() => setShowConfirm(false)}
				onConfirm={handleConfirm}
			/>

			{/* 등록 완료 모달 */}
			<SuccessModal visible={showSuccess} onConfirm={handleSuccessConfirm} />
		</SafeAreaView>
	)
}

export default AnnouncementRegistrationScreen

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: BG,
	},
	scrollView: {
		flex: 1,
		paddingHorizontal: 20,
	},
	screenTitle: {
		fontSize: 24,
		fontWeight: '700',
		color: '#111',
		marginTop: 24,
		marginBottom: 20,
	},
	loadPreviousButton: {
		alignSelf: 'flex-start',
		backgroundColor: PRIMARY,
		padding: 10,
		borderRadius: 8,
		marginBottom: 20,
	},
	loadPreviousText: {
		color: '#fafafa',
		fontSize: 12,
		fontWeight: '700',
	},
	section: {
		marginBottom: 20,
	},
	sectionLabel: {
		fontSize: 20,
		fontWeight: '600',
		color: '#757474',
		marginBottom: 5,
		paddingTop: 10,
		paddingBottom: 5,
	},
	textInput: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: BORDER,
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 18,
		fontSize: 16,
		fontWeight: '500',
		color: '#333',
		minHeight: 60,
	},
	helperText: {
		fontSize: 14,
		fontWeight: '400',
		color: HELPER_COLOR,
		marginTop: 5,
		paddingLeft: 5,
	},

	// 날짜 행
	dateRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
	},
	dateUnitLabel: {
		fontSize: 20,
		fontWeight: '600',
		color: '#757474',
	},
	deadlineLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: PRIMARY,
		marginLeft: 4,
	},

	// 드롭다운
	dropdown: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: BORDER,
		borderRadius: 8,
		paddingHorizontal: 13,
		minHeight: 54,
	},
	dropdownOpen: {
		borderColor: PRIMARY,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderBottomWidth: 0,
	},
	dropdownText: {
		fontSize: 14,
		fontWeight: '600',
		color: BORDER,
		marginRight: 2,
		letterSpacing: 0.4,
	},
	dropdownListOpen: {
		borderWidth: 1,
		borderColor: PRIMARY,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		shadowOpacity: 0,
		elevation: 0,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.25)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dropdownList: {
		backgroundColor: '#fff',
		borderRadius: 10,
		minWidth: 140,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.12,
		shadowRadius: 10,
		elevation: 6,
		overflow: 'hidden',
	},
	dropdownItem: {
		paddingHorizontal: 20,
		paddingVertical: 13,
	},
	dropdownItemSelected: {
		backgroundColor: `${PRIMARY}18`,
	},
	dropdownItemText: {
		fontSize: 14,
		fontWeight: '600',
		color: '#757474',
	},
	dropdownItemTextSelected: {
		color: PRIMARY,
		fontWeight: '700',
	},

	// 토글 버튼
	toggleRow: {
		flexDirection: 'row',
		gap: 10,
	},
	toggleButton: {
		flex: 1,
		height: 54,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 4,
	},
	toggleButtonOn: {
		backgroundColor: PRIMARY,
		borderColor: PRIMARY,
	},
	toggleText: {
		fontSize: 16,
		color: BORDER,
		fontWeight: '600',
		textAlign: 'center',
	},
	toggleTextOn: {
		color: '#fff',
		fontWeight: '600',
		textAlign: 'center',
	},

	// 정기 모임 행
	meetingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		marginTop: 10,
	},
	tilde: {
		fontSize: 14,
		color: '#757474',
	},
	addTimeButton: {
		alignSelf: 'center',
		marginTop: 12,
	},
	addTimeText: {
		fontSize: 14,
		color: PRIMARY,
		fontWeight: '600',
	},

	// 아이콘 + 인풋
	iconInputWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: BORDER,
		borderRadius: 8,
		paddingHorizontal: 15,
		paddingVertical: 18,
		minHeight: 60,
		marginTop: 8,
	},
	iconInput: {
		flex: 1,
		fontSize: 16,
		fontWeight: '500',
		color: '#333',
	},

	// 이미지
	imageRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	imageThumbnail: {
		width: 72,
		height: 72,
		borderRadius: 8,
		overflow: 'hidden',
		position: 'relative',
	},
	thumbnailImg: {
		width: '100%',
		height: '100%',
		resizeMode: 'cover',
	},
	deleteImageBtn: {
		position: 'absolute',
		top: 4,
		right: 4,
		backgroundColor: 'rgba(0,0,0,0.5)',
		borderRadius: 10,
		width: 20,
		height: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	addImageButton: {
		width: 72,
		height: 72,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: '#fff',
		justifyContent: 'center',
		alignItems: 'center',
	},

	// 하단 버튼
	bottomBar: {
		flexDirection: 'row',
		gap: 10,
		paddingHorizontal: 20,
		paddingVertical: 12,
		backgroundColor: BG,
		borderTopWidth: 1,
		borderTopColor: BORDER,
	},
	prevButton: {
		flex: 1,
		height: 44,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: BORDER,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	prevButtonText: {
		fontSize: 16,
		color: BORDER,
		fontWeight: '700',
	},
	submitButton: {
		flex: 1,
		height: 44,
		borderRadius: 8,
		backgroundColor: PRIMARY,
		alignItems: 'center',
		justifyContent: 'center',
	},
	submitButtonText: {
		fontSize: 16,
		color: '#fff',
		fontWeight: '600',
	},

	// 확인 모달
	confirmOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.2)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	confirmBox: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 24,
		width: 320,
		alignItems: 'center',
	},
	confirmTitle: {
		fontSize: 16,
		fontWeight: '700',
		color: '#000000',
		textAlign: 'center',
	},
	confirmDesc: {
		fontSize: 14,
		fontWeight: '500',
		color: '#000000',
		textAlign: 'center',
		lineHeight: 24,
	},
	confirmButtons: {
		flexDirection: 'row',
		gap: 7,
		alignSelf: 'stretch',
	},
	confirmCancel: {
		flex: 1,
		height: 44,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: PRIMARY,
		alignItems: 'center',
		justifyContent: 'center',
	},
	confirmCancelText: {
		fontSize: 16,
		color: PRIMARY,
		fontWeight: '700',
	},
	confirmSubmit: {
		flex: 1,
		height: 44,
		borderRadius: 8,
		backgroundColor: PRIMARY,
		alignItems: 'center',
		justifyContent: 'center',
	},
	confirmSubmitText: {
		fontSize: 16,
		color: '#fff',
		fontWeight: '600',
	},
})
