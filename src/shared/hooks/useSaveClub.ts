import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { Club } from '@/entities/club'
import { useProfile } from '@/shared/contexts/profileContext'
import { useLoginBottomSheet } from '@/shared/contexts/loginBottomSheetContext'
import { serviceContext } from '@/shared/contexts/serviceContext'

const useSaveClub = (club: Club | undefined) => {
	const { user } = useProfile()
	const { openBottomSheet } = useLoginBottomSheet()
	const { clubService } = useContext(serviceContext)
	const queryClient = useQueryClient()

	const initialSaved = user ? (club?.isSaved ?? false) : false
	const [localIsSaved, setLocalIsSaved] = useState(initialSaved)
	const localSavedRef = useRef(initialSaved)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const hasPendingRef = useRef(false)
	const serverIsSavedRef = useRef(initialSaved)
	const pendingShouldSaveRef = useRef<boolean | null>(null)
	const callApiRef = useRef<(shouldSave: boolean) => Promise<void>>()

	// state와 ref를 항상 함께 갱신해 같은 렌더 틱 내 연속 토글에서도 최신 값을 보장
	const applyLocal = useCallback((value: boolean) => {
		localSavedRef.current = value
		setLocalIsSaved(value)
	}, [])

	useEffect(() => {
		if (!hasPendingRef.current) {
			const serverValue = user ? (club?.isSaved ?? false) : false
			applyLocal(serverValue)
			serverIsSavedRef.current = serverValue
		}
	}, [club?.isSaved, user, applyLocal])

	// unmount 시 pending debounce가 있으면 취소 대신 즉시 API 호출
	useEffect(
		() => () => {
			if (debounceRef.current !== null && pendingShouldSaveRef.current !== null) {
				clearTimeout(debounceRef.current)
				callApiRef.current?.(pendingShouldSaveRef.current)
			}
		},
		[],
	)

	const updateClubsCache = useCallback(
		(shouldSave: boolean) => {
			if (!club) return
			const updater = (old: { clubs: Club[]; totalSize: number } | undefined) => {
				if (!old || !old.clubs) return old
				return {
					...old,
					clubs: old.clubs.map(c => (c.uuid === club.uuid ? { ...c, isSaved: shouldSave } : c)),
				}
			}

			queryClient.setQueriesData(['clubs'], updater)
			queryClient.setQueriesData(['searchClubs'], updater)
			queryClient.setQueriesData(
				['savedClubs'],
				(old: { clubs: Club[]; totalSize: number } | undefined) => {
					if (!old) return old
					const alreadyIn = old.clubs.some(c => c.uuid === club.uuid)
					if (shouldSave) {
						const clubs = alreadyIn
							? old.clubs.map(c => (c.uuid === club.uuid ? { ...c, isSaved: true } : c))
							: [...old.clubs, { ...club, isSaved: true }]
						return { ...old, clubs, totalSize: alreadyIn ? old.totalSize : old.totalSize + 1 }
					}
					return {
						...old,
						clubs: old.clubs.filter(c => c.uuid !== club.uuid),
						totalSize: alreadyIn ? old.totalSize - 1 : old.totalSize,
					}
				},
			)
		},
		[club, queryClient],
	)

	const callApi = useCallback(
		async (shouldSave: boolean) => {
			if (!club) return
			// 서버 상태와 동일하면(연속 토글로 원상복귀 등) 불필요한 요청 skip
			if (shouldSave === serverIsSavedRef.current) {
				hasPendingRef.current = false
				pendingShouldSaveRef.current = null
				return
			}
			try {
				if (shouldSave) {
					await clubService.createSavedClub({ clubId: club.uuid })
				} else {
					await clubService.removeSavedClub({ clubId: club.uuid })
				}
				serverIsSavedRef.current = shouldSave
				// 로그인 직후 invalidate 리페치가 옵티미스틱 값을 덮어쓰는 레이스 방지를 위해 확정값 재기록
				updateClubsCache(shouldSave)
			} catch {
				const serverValue = serverIsSavedRef.current
				applyLocal(serverValue)
				updateClubsCache(serverValue)
				Toast.show({ type: 'info', text1: '저장에 실패했어요.' })
			} finally {
				hasPendingRef.current = false
				pendingShouldSaveRef.current = null
			}
		},
		[club, clubService, updateClubsCache, applyLocal],
	)

	// callApiRef를 항상 최신 callApi로 유지 (unmount cleanup에서 stale closure 방지)
	useEffect(() => {
		callApiRef.current = callApi
	}, [callApi])

	const handleToggle = useCallback(() => {
		if (!user) {
			openBottomSheet()
			return
		}

		const next = !localSavedRef.current
		applyLocal(next)
		updateClubsCache(next)
		hasPendingRef.current = true
		pendingShouldSaveRef.current = next

		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => {
			debounceRef.current = null
			callApi(next)
		}, 300)
	}, [user, openBottomSheet, callApi, updateClubsCache, applyLocal])

	return { isSaved: localIsSaved, handleToggle }
}

export default useSaveClub
