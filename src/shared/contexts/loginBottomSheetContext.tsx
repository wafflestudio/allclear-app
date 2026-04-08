import {
	BottomSheetBackdrop,
	BottomSheetBackdropProps,
	BottomSheetModal,
} from '@gorhom/bottom-sheet'
import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { BackHandler, Platform } from 'react-native'
import LoginView from 'shared/components/LoginView'

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
	const isBottomSheetOpenRef = useRef(false)

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
				onDismiss={() => {
					isBottomSheetOpenRef.current = false
				}}
				backdropComponent={renderBackdrop}>
				<LoginView closeBottomSheet={closeBottomSheet} />
			</BottomSheetModal>
		</LoginBottomSheetContext.Provider>
	)
}
