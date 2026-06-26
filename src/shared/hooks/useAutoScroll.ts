import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useRef } from 'react'
import { FlatList } from 'react-native'
import type { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

const AUTO_SCROLL_INTERVAL_MS = 16
const AUTO_SCROLL_STEP = 0.5

const useAutoScroll = <T>(itemCount: number) => {
	const listRef = useRef<FlatList<T>>(null)
	const scrollOffsetRef = useRef(0)
	const contentWidthRef = useRef(0)
	const listWidthRef = useRef(0)
	const maxScrollOffsetRef = useRef(0)
	const isUserInteractingRef = useRef(false)
	const isAutoScrollFinishedRef = useRef(false)

	const updateMaxScrollOffset = () => {
		maxScrollOffsetRef.current = Math.max(contentWidthRef.current - listWidthRef.current, 0)
	}

	const pauseAutoScroll = () => {
		isUserInteractingRef.current = true
	}

	const resumeAutoScroll = () => {
		isUserInteractingRef.current = false
	}

	const handleLayout = (event: LayoutChangeEvent) => {
		listWidthRef.current = event.nativeEvent.layout.width
		updateMaxScrollOffset()
	}

	const handleContentSizeChange = (contentWidth: number) => {
		contentWidthRef.current = contentWidth
		isAutoScrollFinishedRef.current = false
		updateMaxScrollOffset()
	}

	const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		const currentOffset = event.nativeEvent.contentOffset.x
		scrollOffsetRef.current = currentOffset
		isAutoScrollFinishedRef.current = currentOffset >= maxScrollOffsetRef.current
	}

	useFocusEffect(
		useCallback(() => {
			if (itemCount <= 1) return

			scrollOffsetRef.current = 0
			isAutoScrollFinishedRef.current = false
			listRef.current?.scrollToOffset({ offset: 0, animated: false })

			const intervalId = setInterval(() => {
				if (
					isUserInteractingRef.current ||
					isAutoScrollFinishedRef.current ||
					maxScrollOffsetRef.current <= 0
				) {
					return
				}

				const nextOffset = Math.min(
					scrollOffsetRef.current + AUTO_SCROLL_STEP,
					maxScrollOffsetRef.current,
				)

				scrollOffsetRef.current = nextOffset
				isAutoScrollFinishedRef.current = nextOffset >= maxScrollOffsetRef.current
				listRef.current?.scrollToOffset({ offset: nextOffset, animated: false })
			}, AUTO_SCROLL_INTERVAL_MS)

			return () => clearInterval(intervalId)
		}, [itemCount]),
	)

	return {
		listRef,
		onLayout: handleLayout,
		onContentSizeChange: handleContentSizeChange,
		onScroll: handleScroll,
		onTouchStart: pauseAutoScroll,
		onTouchEnd: resumeAutoScroll,
		onTouchCancel: resumeAutoScroll,
		onScrollBeginDrag: pauseAutoScroll,
		onMomentumScrollBegin: pauseAutoScroll,
		onMomentumScrollEnd: resumeAutoScroll,
	}
}

export default useAutoScroll
