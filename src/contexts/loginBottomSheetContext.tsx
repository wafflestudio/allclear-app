import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { createContext, useCallback, useContext, useRef } from 'react'
import { Platform } from 'react-native'
import LoginView from 'screens/components/LoginView'

const LoginBottomSheetContext = createContext<{
	openBottomSheet: () => void
	closeBottomSheet: () => void
}>({
	openBottomSheet: () => {},
	closeBottomSheet: () => {},
})

export const useLoginBottomSheet = () => useContext(LoginBottomSheetContext)

type Props = {
	children: React.ReactNode
}

export const LoginBottomSheetProvider = ({ children }: Props) => {
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
		<LoginBottomSheetContext.Provider
			value={{
				openBottomSheet,
				closeBottomSheet,
			}}>
			{children}
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={[Platform.OS === 'ios' ? 310 : 260]}
				backdropComponent={renderBackdrop}>
				<LoginView closeBottomSheet={closeBottomSheet} />
			</BottomSheetModal>
		</LoginBottomSheetContext.Provider>
	)
}
