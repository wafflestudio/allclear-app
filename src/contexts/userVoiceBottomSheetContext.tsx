import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { createContext, useCallback, useContext, useRef } from 'react'
import { Platform } from 'react-native'
import UserVoiceView from 'screens/components/UserVoiceView'

const UserVoiceBottomSheetContext = createContext<{
	openBottomSheet: () => void
	closeBottomSheet: () => void
}>({
	openBottomSheet: () => {},
	closeBottomSheet: () => {},
})

export const useUserVoiceBottomSheet = () => useContext(UserVoiceBottomSheetContext)

type Props = {
	children: React.ReactNode
}

export const UserVoiceBottomSheetProvider = ({ children }: Props) => {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null)

	const renderBackdrop = useCallback(
		(props: BottomSheetBackdropProps) => (
			<BottomSheetBackdrop
				{...props}
				pressBehavior={'close'}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
			/>
		),
		[],
	)

	const openBottomSheet = useCallback(() => {
		bottomSheetModalRef.current?.present()
	}, [])

	const closeBottomSheet = useCallback(() => {
		bottomSheetModalRef.current?.close()
	}, [])

	return (
		<UserVoiceBottomSheetContext.Provider
			value={{
				openBottomSheet,
				closeBottomSheet,
			}}>
			{children}
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={[Platform.OS === 'ios' ? 400 : 350]}
				backdropComponent={renderBackdrop}>
				<UserVoiceView closeBottomSheet={closeBottomSheet} />
			</BottomSheetModal>
		</UserVoiceBottomSheetContext.Provider>
	)
}
