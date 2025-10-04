import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { createContext, useCallback, useContext, useRef } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import ManageClubView from 'screens/components/ManageClubView'

const ManageClubBottomSheetContext = createContext<{
	openBottomSheet: () => void
	closeBottomSheet: () => void
}>({
	openBottomSheet: () => {},
	closeBottomSheet: () => {},
})

export const useManageClubBottomSheet = () => useContext(ManageClubBottomSheetContext)

type Props = {
	children: React.ReactNode
}

export const ManageClubBottomSheetProvider = ({ children }: Props) => {
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
		<ManageClubBottomSheetContext.Provider
			value={{
				openBottomSheet,
				closeBottomSheet,
			}}>
			{children}
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={[300]}
				backdropComponent={renderBackdrop}>
				<KeyboardAvoidingView behavior="height">
					<ManageClubView closeBottomSheet={closeBottomSheet} />
				</KeyboardAvoidingView>
			</BottomSheetModal>
		</ManageClubBottomSheetContext.Provider>
	)
}
