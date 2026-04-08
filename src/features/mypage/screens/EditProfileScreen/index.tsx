import { useQuery } from '@tanstack/react-query'
import { Colors } from 'shared/constants/colors'
import { useProfile } from 'shared/contexts/profileContext'
import { serviceContext } from 'shared/contexts/serviceContext'
import React, { useContext, useState } from 'react'
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { navigation } from 'shared/utils/navigation'
import Header from './Header'
import Toast from 'react-native-toast-message'

const EditProfileScreen = () => {
	const { user, setUser } = useProfile()
	const { data: collegeMajors } = useCollegeMajors()
	const { userService } = useContext(serviceContext)

	const [name, setName] = useState(user?.nickname || '')
	const [college, setCollege] = useState(user?.college || '')
	const [major, setMajor] = useState(user?.major || '')
	const [admissionClass, setAdmissionClass] = useState(user?.admissionClass || 24)

	const [openCollegeDropDown, setOpenCollegeDropDown] = useState(false)
	const [openMajorDropDown, setOpenMajorDropDown] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const colleges = collegeMajors?.reduce((acc, cur) => {
		if (!acc.includes(cur.college)) {
			acc.push(cur.college)
		}
		return acc
	}, [] as string[])

	const majors = collegeMajors?.reduce((acc, cur) => {
		if (!acc.includes(cur.major) && cur.college === college) {
			acc.push(cur.major)
		}
		return acc
	}, [] as string[])

	const handleSubmit = async () => {
		try {
			setIsSubmitting(true)
			// validation
			if (!name) {
				Toast.show({
					type: 'info',
					text1: '이름을 입력해주세요',
					position: 'bottom',
				})
				return
			}

			if (!college) {
				Toast.show({
					type: 'info',
					text1: '단과대를 선택해주세요',
					position: 'bottom',
				})
				return
			}

			if (!major) {
				Toast.show({
					type: 'info',
					text1: '학과를 선택해주세요',
					position: 'bottom',
				})
				return
			}

			const collegeMajorId = collegeMajors?.find(
				cm => cm.college === college && cm.major === major,
			)?.id

			if (!collegeMajorId) {
				Toast.show({
					type: 'info',
					text1: '단과대 및 학과를 다시 선택해주세요',
					position: 'bottom',
				})
				return
			}

			Keyboard.dismiss()
			await userService.updateUser({
				nickname: name,
				collegeMajorId,
				major,
				admissionClass,
			})

			const updatedUser = await userService.getUser()
			setUser(updatedUser)
			navigation.goBack()

			Toast.show({
				type: 'info',
				text1: `프로필이 수정되었어요!`,
				position: 'bottom',
				visibilityTime: 2000,
			})
		} catch (err) {
			Toast.show({
				type: 'info',
				text1: `이런! 문제가 생겼어요!`,
				position: 'bottom',
				visibilityTime: 2000,
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: '#F5F4F0' }}>
			<Header onBack={() => navigation.goBack()} />
			<View style={{ padding: 16 }}>
				<View style={{ marginBottom: 32 }}>
					<Text
						style={{
							color: Colors.GRAY_40,
							fontWeight: 'bold',
							marginBottom: 8,
						}}>
						이름
					</Text>
					<TextInput
						style={{
							borderRadius: 12,
							paddingHorizontal: 20,
							paddingVertical: 16,
							backgroundColor: Colors.WHITE,
						}}
						value={name}
						onChangeText={setName}
						placeholder="이름을 입력하세요"
						maxLength={10}
					/>
				</View>

				<View style={{ marginBottom: 8, zIndex: 10, position: 'relative' }}>
					<Text
						style={{
							color: Colors.GRAY_40,
							fontWeight: 'bold',
							marginBottom: 8,
						}}>
						단과대 및 학과
					</Text>
					<DropDownPicker
						open={openCollegeDropDown}
						setOpen={val => {
							setOpenCollegeDropDown(val)
							setOpenMajorDropDown(false)
						}}
						value={college}
						setValue={setCollege}
						items={colleges?.map(c => ({ label: c, value: c })) ?? []}
						placeholder="단과대를 선택해주세요"
						style={{
							borderWidth: 0,
							paddingHorizontal: 20,
							paddingVertical: 12,
							borderRadius: 12,
						}}
						dropDownContainerStyle={{
							borderWidth: 0,
							backgroundColor: Colors.WHITE,
							paddingHorizontal: 12,
							paddingVertical: 4,
							zIndex: 11,
						}}
						closeOnBackPressed
						ArrowDownIconComponent={renderArrowDownIcon}
						ArrowUpIconComponent={renderArrowUpIcon}
					/>
				</View>
				<View style={{ marginBottom: 32, zIndex: 9, position: 'relative' }}>
					<DropDownPicker
						disabled={!college}
						disabledStyle={{ backgroundColor: Colors.GRAY_20 }}
						open={openMajorDropDown}
						setOpen={val => {
							setOpenCollegeDropDown(false)
							setOpenMajorDropDown(val)
						}}
						value={major}
						setValue={setMajor}
						items={majors?.map(c => ({ label: c, value: c })) ?? []}
						placeholder="학과를 선택해주세요"
						style={{
							zIndex: -1,
							borderWidth: 0,
							paddingHorizontal: 20,
							paddingVertical: 12,
							borderRadius: 12,
						}}
						dropDownContainerStyle={{
							borderWidth: 0,
							backgroundColor: Colors.WHITE,
							paddingHorizontal: 12,
							paddingVertical: 4,
						}}
						closeOnBackPressed
						ArrowDownIconComponent={renderArrowDownIcon}
						ArrowUpIconComponent={renderArrowUpIcon}
					/>
				</View>

				<View style={{ marginBottom: 40 }}>
					<Text
						style={{
							color: Colors.GRAY_40,
							fontWeight: 'bold',
							marginBottom: 8,
						}}>
						학번
					</Text>
					<View
						style={{
							backgroundColor: Colors.WHITE,
							borderWidth: 0,
							borderRadius: 12,
							paddingHorizontal: 20,
							paddingVertical: 12,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}>
						<TouchableOpacity onPress={() => setAdmissionClass(Math.max(admissionClass - 1, 0))}>
							<CommunityIcon name="minus" size={24} color={Colors.GRAY_30} />
						</TouchableOpacity>
						<Text
							style={{
								fontSize: 16,
								fontWeight: 'bold',
								color: Colors.GRAY_50,
							}}>{`${admissionClass}학번`}</Text>
						<TouchableOpacity onPress={() => setAdmissionClass(Math.min(admissionClass + 1, 30))}>
							<CommunityIcon name="plus" size={24} color={Colors.GRAY_30} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View style={{ flex: 1, paddingHorizontal: 16 }}>
				<TouchableOpacity
					disabled={isSubmitting}
					onPress={handleSubmit}
					style={{
						padding: 16,
						borderRadius: 12,
						marginBottom: 12,
						backgroundColor: Colors.GRAY_50,
						marginTop: 'auto',
					}}>
					<Text
						style={{
							color: Colors.WHITE,
							fontSize: 16,
							textAlign: 'center',
							fontWeight: 'bold',
						}}>
						저장
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	)
}

export default EditProfileScreen

const useCollegeMajors = () => {
	const { userService } = useContext(serviceContext)
	return useQuery(['collegeMajors'], () => userService.listCollegeMajors(), {
		keepPreviousData: true,
		select: data => data.majors,
	})
}

function renderArrowDownIcon() {
	return <Icon name="keyboard-arrow-down" size={24} style={{ color: Colors.GRAY_30 }} />
}

function renderArrowUpIcon() {
	return <Icon name="keyboard-arrow-up" size={24} style={{ color: Colors.GRAY_30 }} />
}
