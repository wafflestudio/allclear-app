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
import { RegisterClubFormData, initialFormData } from '@/features/register-club/types'
import { RegisterClubRequest } from '@/repositories/club'

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
	const { clubService } = useContext(serviceContext)
	const { user } = useProfile()
	const { openBottomSheet: openLoginSheet } = useLoginBottomSheet()

	const handleFormDataChange = (data: Partial<RegisterClubFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }))
	}

	const handleNext = () => {
		setCurrentStep((prev) => Math.min(prev + 1, 4))
	}

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0))
	}

	const handleComplete = async () => {
		// Check if user is logged in
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

		try {
			setIsLoading(true)
			const request = mapFormDataToRequest(formData)
			console.log('[REGISTER_CLUB] Request:', JSON.stringify(request, null, 2))
			console.log('[REGISTER_CLUB] About to call registerClub API...')
			const response = await clubService.registerClub(request)
			console.log('[REGISTER_CLUB] Response:', JSON.stringify(response, null, 2))
			console.log('[REGISTER_CLUB] Response type:', typeof response)
			console.log('[REGISTER_CLUB] Response keys:', response ? Object.keys(response) : 'null')
			console.log('[REGISTER_CLUB] Response.success:', (response as any)?.success)

			const isSuccess = (response as any)?.success === true
			const message = (response as any)?.message || '동아리 등록이 완료되었습니다!'

			if (isSuccess) {
				Toast.show({
					type: 'success',
					text1: message,
					position: 'top',
					topOffset: 60,
					visibilityTime: 2000,
				})

				// Reset form and go back to step 0
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
			console.error('[REGISTER_CLUB] Caught error:', error)
			console.error('[REGISTER_CLUB] Error type:', typeof error)

			let errorMessage = '동아리 등록 중 오류가 발생했습니다'

			if (error instanceof Error) {
				console.error('[REGISTER_CLUB] Error name:', error.name)
				console.error('[REGISTER_CLUB] Error message:', error.message)
				console.error('[REGISTER_CLUB] Error stack:', error.stack)

				// Check if it's an Axios error with response data
				const axiosError = error as any
				if (axiosError?.response?.status === 401) {
					console.error('[REGISTER_CLUB] Got 401 - checking response body:', axiosError?.response?.data)
				}
				if (axiosError?.response?.data?.message) {
					errorMessage = axiosError.response.data.message
				} else if (axiosError?.response?.status) {
					errorMessage = `Error ${axiosError.response.status}: ${error.message}`
				}
			}

			console.error('[REGISTER_CLUB] Final error message:', errorMessage)
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
			onComplete={handleComplete}
			onPrevious={handlePrevious}
			isLoading={isLoading}
		/>,
	]

	return screens[currentStep]
}
