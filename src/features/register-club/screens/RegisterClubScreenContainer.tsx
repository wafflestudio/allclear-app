import React, { useContext, useState } from 'react'
import Toast from 'react-native-toast-message'
import { serviceContext } from '@/shared/contexts/serviceContext'
import { useProfile } from '@/shared/contexts/profileContext'
import { useLoginBottomSheet } from '@/shared/contexts/loginBottomSheetContext'
import { ManagerInfoScreen } from '@/features/register-club/screens/ManagerInfoScreen'
import { ClubBasicInfoScreen } from '@/features/register-club/screens/ClubBasicInfoScreen'
import { CategorySelectionScreen } from '@/features/register-club/screens/CategorySelectionScreen'
import { ClubAffiliationScreen } from '@/features/register-club/screens/ClubAffiliationScreen'
import { ClubDetailsScreen } from '@/features/register-club/screens/ClubDetailsScreen'
import { RegisterClubConfirmModal } from '@/features/register-club/components/RegisterClubConfirmModal'
import { RegisterClubFormData, initialFormData } from '@/features/register-club/types'
import { RegisterClubRequest } from '@/repositories/club'
import { navigation } from '@/shared/utils/navigation'

const mapFormDataToRequest = (formData: RegisterClubFormData): RegisterClubRequest => {
	const clubData: Record<string, unknown> = {
		name: formData.clubName,
		type: '교내',
		image_uri: formData.clubImage || '',
		category: formData.selectedCategories[0] || '',
		affiliation: formData.department,
		short_description: formData.shortIntro,
		recruit_type: formData.recruitType,
		min_activity_period: parseInt(formData.activityCycle, 10) || 0,
		has_dongbang: formData.hasDongbang,
		sns: formData.clubSNS,
		introduction: formData.clubDescription,
	}

	// Add dongbang_location only if has_dongbang is true
	if (formData.hasDongbang && formData.dongbangLocation) {
		clubData.dongbang_location = formData.dongbangLocation
	}

	return {
		club_data: clubData as RegisterClubRequest['club_data'],
		manager_data: {
			name: formData.managerName,
			phone: formData.managerPhone,
			student_id: formData.studentId,
		},
	}
}

export const RegisterClubScreenContainer = () => {
	const [currentStep, setCurrentStep] = useState(0)
	const [formData, setFormData] = useState<RegisterClubFormData>(initialFormData)
	const [isLoading, setIsLoading] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)
	const { clubService } = useContext(serviceContext)
	const { user } = useProfile()
	const { openBottomSheet: openLoginSheet } = useLoginBottomSheet()

	const handleFormDataChange = (data: Partial<RegisterClubFormData>) => {
		setFormData(prev => ({ ...prev, ...data }))
	}

	const handleNext = () => {
		setCurrentStep(prev => Math.min(prev + 1, 4))
	}

	const handlePrevious = () => {
		setCurrentStep(prev => Math.max(prev - 1, 0))
	}

	// 이전 on the first step exits the full-screen flow back to the MyPage tab.
	const handleExit = () => {
		setCurrentStep(0)
		navigation.navigate('마이')
	}

	const handleOpenConfirm = () => {
		// Check if user is logged in before showing the confirmation
		if (!user) {
			Toast.show({
				type: 'error',
				text1: '로그인이 필요해요',
				text2: '동아리를 등록하려면 로그인해주세요',
				position: 'top',
				topOffset: 60,
				visibilityTime: 2000,
			})
			openLoginSheet()
			return
		}
		setShowConfirm(true)
	}

	const handleComplete = async () => {
		try {
			setIsLoading(true)
			const request = mapFormDataToRequest(formData)
			const response = await clubService.registerClub(request)

			const isSuccess = response?.success === true
			const message = response?.message || '동아리 등록이 완료되었습니다!'

			if (isSuccess) {
				Toast.show({
					type: 'success',
					text1: message,
					position: 'top',
					topOffset: 60,
					visibilityTime: 2000,
				})

				// Reset form and go back to step 0
				setShowConfirm(false)
				setFormData(initialFormData)
				setCurrentStep(0)
			} else {
				Toast.show({
					type: 'error',
					text1: message || '동아리 등록 중 오류가 발생했습니다',
					position: 'top',
					topOffset: 60,
					visibilityTime: 2000,
				})
			}
		} catch (error) {
			let errorMessage = '동아리 등록 중 오류가 발생했습니다'

			if (error instanceof Error) {
				// Check if it's an Axios error with response data
				const axiosError = error as {
					response?: { status?: number; data?: { message?: string } }
				}
				if (axiosError?.response?.data?.message) {
					errorMessage = axiosError.response.data.message
				} else if (axiosError?.response?.status) {
					errorMessage = `Error ${axiosError.response.status}: ${error.message}`
				}
			}

			Toast.show({
				type: 'error',
				text1: errorMessage,
				position: 'top',
				topOffset: 60,
				visibilityTime: 2000,
			})
		} finally {
			setIsLoading(false)
		}
	}

	const screens = [
		<ManagerInfoScreen
			key="step0"
			formData={formData}
			onFormDataChange={handleFormDataChange}
			onNext={handleNext}
			onPrevious={handleExit}
		/>,
		<ClubBasicInfoScreen
			key="step1"
			formData={formData}
			onFormDataChange={handleFormDataChange}
			onNext={handleNext}
			onPrevious={handlePrevious}
		/>,
		<CategorySelectionScreen
			key="step2"
			formData={formData}
			onFormDataChange={handleFormDataChange}
			onNext={handleNext}
			onPrevious={handlePrevious}
		/>,
		<ClubAffiliationScreen
			key="step3"
			formData={formData}
			onFormDataChange={handleFormDataChange}
			onNext={handleNext}
			onPrevious={handlePrevious}
		/>,
		<ClubDetailsScreen
			key="step4"
			formData={formData}
			onFormDataChange={handleFormDataChange}
			onComplete={handleOpenConfirm}
			onPrevious={handlePrevious}
			isLoading={isLoading}
		/>,
	]

	// 6 stages total: the 5 form steps plus the final confirmation popup,
	// so the bar is never fully filled while a form step is on screen.
	const progress = (currentStep + 1) / (screens.length + 1)

	return (
		<>
			{React.cloneElement(screens[currentStep], { progress })}
			<RegisterClubConfirmModal
				visible={showConfirm}
				clubName={formData.clubName}
				isLoading={isLoading}
				onCancel={() => setShowConfirm(false)}
				onConfirm={handleComplete}
			/>
		</>
	)
}
