import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { BackHandler, Platform } from 'react-native'
import RegisterClubTypeView from '@/shared/components/RegisterClubTypeView'

// The kinds offered in the entry bottom sheet. '교내'/'교외' map to the
// registration form's club type; 'existing' is the existing-manager flow.
export type RegisterClubKind = '교내' | '교외' | 'existing'

const RegisterClubTypeBottomSheetContext = createContext<{
	openBottomSheet: () => void
	closeBottomSheet: () => void
	selectedKind: RegisterClubKind | null
	setSelectedKind: (kind: RegisterClubKind) => void
}>({
	openBottomSheet: () => {},
	closeBottomSheet: () => {},
	selectedKind: null,
	setSelectedKind: () => {},
})

export const useRegisterClubTypeBottomSheet = () => useContext(RegisterClubTypeBottomSheetContext)

type Props = {
	children: React.ReactNode
}

export const RegisterClubTypeBottomSheetProvider = ({ children }: Props) => {
	const bottomSheetModalRef = useRef<BottomSheetModal>(null)
	const isBottomSheetOpenRef = useRef(false)
	const [selectedKind, setSelectedKind] = useState<RegisterClubKind | null>(null)

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
		isBottomSheetOpenRef.current = true
		bottomSheetModalRef.current?.present()
	}, [])

	const closeBottomSheet = useCallback(() => {
		isBottomSheetOpenRef.current = false
		bottomSheetModalRef.current?.close()
	}, [])

	useEffect(() => {
		const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
			if (!isBottomSheetOpenRef.current) {
				return false
			}

			closeBottomSheet()
			return true
		})

		return () => subscription.remove()
	}, [closeBottomSheet])

	return (
		<RegisterClubTypeBottomSheetContext.Provider
			value={{
				openBottomSheet,
				closeBottomSheet,
				selectedKind,
				setSelectedKind,
			}}>
			{children}
			<BottomSheetModal
				ref={bottomSheetModalRef}
				index={0}
				snapPoints={[Platform.OS === 'ios' ? 400 : 380]}
				onDismiss={() => {
					isBottomSheetOpenRef.current = false
				}}
				backdropComponent={renderBackdrop}>
				<RegisterClubTypeView closeBottomSheet={closeBottomSheet} />
			</BottomSheetModal>
		</RegisterClubTypeBottomSheetContext.Provider>
	)
}
