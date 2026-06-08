import { useCallback, useContext, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { Club } from '@/entities/club'
import { ListSavedClubsResponse } from '@/repositories/club'
import { useProfile } from '@/shared/contexts/profileContext'
import { useLoginBottomSheet } from '@/shared/contexts/loginBottomSheetContext'
import { serviceContext } from '@/shared/contexts/serviceContext'

const selectSavedIds = (data: ListSavedClubsResponse) => new Set(data.clubs.map(c => c.uuid)) // 모듈 레벨에서 선언하여 매번 새로 생성하지 않음

const useSaveClub = (club: Club | undefined) => {
	const { user } = useProfile()
	const { openBottomSheet } = useLoginBottomSheet()
	const { clubService } = useContext(serviceContext)
	const queryClient = useQueryClient()

	// 저장 여부의 SoT는 savedClubs 캐시
	const { data: savedIds } = useQuery(['savedClubs'], () => clubService.listSavedClubs(), {
		enabled: !!user,
		staleTime: Infinity,
		select: selectSavedIds, // Set<uuid> 형태로 저장
	})

	const isSaved = club ? (savedIds?.has(club.uuid) ?? false) : false // 저장 여부 계산

	const serverIsSavedRef = useRef(isSaved) // 기존 서버 상태 (skip/롤백용)
	const pendingShouldSaveRef = useRef<boolean | null>(null) // 대기 중인 토글의 최종 목표 상태 (null: 대기 없음)

	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const hasPendingRef = useRef(false) // API 요청이 진행 중인지 여부
	const callApiRef = useRef<(shouldSave: boolean) => Promise<void>>() // flush 시점에 최신 callApi 참조용

	// serverIsSavedRef 초기화
	useEffect(() => {
		if (!hasPendingRef.current) {
			serverIsSavedRef.current = club ? (savedIds?.has(club.uuid) ?? false) : false
		}
	}, [savedIds, club])

	// savedClubs 캐시 업데이트
	const updateSavedClubsCache = useCallback(
		(shouldSave: boolean) => {
			if (!club) return
			// 진행 중인 refetch가 optimistic 값을 덮어쓰지 못하도록 먼저 취소
			queryClient.cancelQueries(['savedClubs'])

			queryClient.setQueriesData(
				['savedClubs'],
				(old: { clubs: Club[]; totalSize: number } | undefined) => {
					if (!old) return old
					const alreadyIn = old.clubs.some(c => c.uuid === club.uuid)
					if (shouldSave) {
						if (alreadyIn) return old
						return { ...old, clubs: [...old.clubs, club], totalSize: old.totalSize + 1 }
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

	// API 호출 함수
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
			} catch {
				// 실패 시 서버 상태로 롤백
				updateSavedClubsCache(serverIsSavedRef.current)
				Toast.show({ type: 'info', text1: '저장에 실패했어요.' })
			} finally {
				hasPendingRef.current = false
				pendingShouldSaveRef.current = null
			}
		},
		[club, clubService, updateSavedClubsCache],
	)

	// 토글 핸들러
	const handleToggle = useCallback(() => {
		if (!user) {
			openBottomSheet()
			return
		}
		if (!club) return

		const displayed = savedIds?.has(club.uuid) ?? false
		const baseline =
			pendingShouldSaveRef.current !== null ? pendingShouldSaveRef.current : displayed
		const next = !baseline

		updateSavedClubsCache(next)
		hasPendingRef.current = true
		pendingShouldSaveRef.current = next

		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => {
			debounceRef.current = null
			callApi(next)
		}, 300)
	}, [user, club, savedIds, openBottomSheet, callApi, updateSavedClubsCache])

	// callApiRef를 항상 최신 callApi로 유지
	useEffect(() => {
		callApiRef.current = callApi
	}, [callApi])

	// unmount 시 pending debounce가 있으면 취소 대신 즉시 API 호출
	useEffect(
		() => () => {
			if (debounceRef.current !== null && pendingShouldSaveRef.current !== null) {
				clearTimeout(debounceRef.current)
				callApiRef.current?.(pendingShouldSaveRef.current) // api 호출
			}
		},
		[],
	)

	return { isSaved, handleToggle }
}

export default useSaveClub
