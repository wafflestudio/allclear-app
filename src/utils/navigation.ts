// NOTE(MG.S): navigation 전역적으로 활용하기 위해 정의한 파일
import { NavigationContainerRef } from '@react-navigation/core'
import { CommonActions, DrawerActions, StackActions } from '@react-navigation/native'
import React from 'react'

// https://reactnavigation.org/docs/navigating-without-navigation-prop/#handling-initialization
let _isNavigationReady = false
export const setIsNavigationReady = (isReady: boolean) => {
	_isNavigationReady = isReady
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const _navigationRef = React.createRef<NavigationContainerRef<any>>()

export const navigation = {
	navigate: (name: string, params?: object) => {
		if (!_isNavigationReady) return
		_navigationRef.current?.navigate(name, params)
	},
	openDrawer() {
		if (!_isNavigationReady) return
		_navigationRef.current?.dispatch(DrawerActions.openDrawer())
	},
	closeDrawer() {
		if (!_isNavigationReady) return
		_navigationRef.current?.dispatch(DrawerActions.closeDrawer())
	},
	setRoot(name: string, params?: object) {
		if (!_isNavigationReady) return
		_navigationRef.current?.dispatch(
			CommonActions.reset({
				index: 0,
				// @ts-ignore
				routes: [{ name, params }],
			}),
		)
	},
	push(name: string, params?: object) {
		if (!_isNavigationReady) return
		const pushAction = StackActions.push(name, params)
		_navigationRef.current?.dispatch(pushAction)
	},
	goBack() {
		if (!_isNavigationReady) return
		_navigationRef.current?.goBack()
	},
	replace(name: string, params?: object) {
		if (!_isNavigationReady) return
		_navigationRef.current?.dispatch(StackActions.replace(name, params))
	},
}
