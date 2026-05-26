import React, { useState } from 'react'
import Toast from 'react-native-toast-message'
import { ManagerInfoScreen } from '@/features/register-club/screens/ManagerInfoScreen'
import { ClubBasicInfoScreen } from '@/features/register-club/screens/ClubBasicInfoScreen'
import { CategorySelectionScreen } from '@/features/register-club/screens/CategorySelectionScreen'
import { ClubAffiliationScreen } from '@/features/register-club/screens/ClubAffiliationScreen'
import { ClubDetailsScreen } from '@/features/register-club/screens/ClubDetailsScreen'
import { RegisterClubFormData, initialFormData } from '@/features/register-club/types'

export const RegisterClubScreenContainer = () => {
	const [currentStep, setCurrentStep] = useState(0)
	const [formData, setFormData] = useState<RegisterClubFormData>(initialFormData)

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
		try {
			// TODO: Call the API to submit club registration
			// const { clubService } = useContext(serviceContext)
			// await clubService.createClub(formData)

			Toast.show({
				type: 'success',
				text1: '동아리 등록이 완료되었습니다!',
				position: 'top',
				topOffset: 60,
				visibilityTime: 2000,
			})

			// Reset form and go back to step 0
			setFormData(initialFormData)
			setCurrentStep(0)
		} catch {
			Toast.show({
				type: 'error',
				text1: '동아리 등록 중 오류가 발생했습니다',
				position: 'top',
				topOffset: 60,
				visibilityTime: 2000,
			})
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
		/>,
	]

	return screens[currentStep]
}
