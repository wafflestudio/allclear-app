import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LayoutChangeEvent, PanResponder } from 'react-native'
import { clamp } from '@/shared/utils/math'
import { ms } from '@/shared/utils/scale'

export const THUMB_SIZE = ms(10)
const SEMESTER_VALUES = [1, 2, 3, 4] as const

export type MinDurationValue = {
  min: number
  max: number
} | null

type ThumbSide = 'left' | 'right'

type SliderState = {
  labelCenters: number[]
  isUnlimited: boolean
  selectedStartIndex: number
  selectedEndIndex: number
  leftDragCenter: number | null
  rightDragCenter: number | null
}

type UseMinDurationSliderOptions = {
  value: MinDurationValue
  onChange: (value: MinDurationValue) => void
}

const getClosestSlotIndex = (positionX: number, centers: number[]) => {
  if (centers.length === 0) {
    return 0
  }

  return centers.reduce((closestIndex, centerX, index) => {
    const closestDistance = Math.abs(positionX - centers[closestIndex])
    const nextDistance = Math.abs(positionX - centerX)

    return nextDistance < closestDistance ? index : closestIndex
  }, 0)
}

const getClampedLeftCenter = (centerX: number, minCenterX: number, rightCenterX: number) =>
  clamp(centerX, minCenterX, rightCenterX - THUMB_SIZE)

const getClampedRightCenter = (centerX: number, leftCenterX: number, maxCenterX: number) =>
  clamp(centerX, leftCenterX + THUMB_SIZE, maxCenterX)

const clampIndex = (index: number) => clamp(index, 0, SEMESTER_VALUES.length - 1)

const getInitialIndices = (value: MinDurationValue) => {
  if (value === null) {
    return { startIndex: 0, endIndex: SEMESTER_VALUES.length - 1 }
  }
  return {
    startIndex: clampIndex(value.min - 1),
    endIndex: clampIndex(value.max - 1),
  }
}

const indicesToValue = (startIndex: number, endIndex: number): MinDurationValue => ({
  min: SEMESTER_VALUES[startIndex],
  max: SEMESTER_VALUES[endIndex],
})

export const useMinDurationSlider = ({ value, onChange }: UseMinDurationSliderOptions) => {
  const isUnlimited = value === null
  const { startIndex: initialStartIndex, endIndex: initialEndIndex } = getInitialIndices(value)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [labelCenters, setLabelCenters] = useState<number[]>([])
  const [selectedStartIndex, setSelectedStartIndex] = useState(initialStartIndex)
  const [selectedEndIndex, setSelectedEndIndex] = useState(initialEndIndex)
  const [leftDragCenter, setLeftDragCenter] = useState<number | null>(null)
  const [rightDragCenter, setRightDragCenter] = useState<number | null>(null)

  useEffect(() => {
    if (value === null) {
      return
    }
    setSelectedStartIndex(clampIndex(value.min - 1))
    setSelectedEndIndex(clampIndex(value.max - 1))
  }, [value])

  const stateRef = useRef<SliderState>({
    labelCenters: [],
    isUnlimited,
    selectedStartIndex: initialStartIndex,
    selectedEndIndex: initialEndIndex,
    leftDragCenter: null,
    rightDragCenter: null,
  })
  const dragStartCenterRef = useRef({
    left: 0,
    right: 0,
  })

  stateRef.current = {
    labelCenters,
    isUnlimited,
    selectedStartIndex,
    selectedEndIndex,
    leftDragCenter,
    rightDragCenter,
  }

  const handleToggleUnlimited = useCallback(() => {
    const currentState = stateRef.current
    if (currentState.isUnlimited) {
      onChangeRef.current(indicesToValue(currentState.selectedStartIndex, currentState.selectedEndIndex))
    } else {
      onChangeRef.current(null)
    }
  }, [])

  const handleLabelLayout = useCallback(
    (index: number, event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout
      const centerX = x + width / 2

      setLabelCenters(prev => {
        if (prev[index] === centerX) {
          return prev
        }

        const next = [...prev]
        next[index] = centerX
        return next
      })
    },
    []
  )

  const trackStart = labelCenters[0] ?? 0
  const trackEnd = labelCenters[SEMESTER_VALUES.length - 1] ?? 0
  const trackWidth = Math.max(trackEnd - trackStart, 0)

  const selectedStartX = leftDragCenter ?? labelCenters[selectedStartIndex] ?? trackStart
  const selectedEndX = rightDragCenter ?? labelCenters[selectedEndIndex] ?? trackEnd
  const selectedTrackWidth = Math.max(selectedEndX - selectedStartX, 0)

  const { leftThumbPanResponder, rightThumbPanResponder } = useMemo(() => {
    const createPanResponder = (side: ThumbSide) =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !stateRef.current.isUnlimited,
        onMoveShouldSetPanResponder: () => !stateRef.current.isUnlimited,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          const currentState = stateRef.current
          const currentLabelCenters = currentState.labelCenters
          const startIndex =
            side === 'left'
              ? currentState.selectedStartIndex
              : currentState.selectedEndIndex
          const startCenter = currentLabelCenters[startIndex] ?? 0

          dragStartCenterRef.current[side] = startCenter

          if (side === 'left') {
            setLeftDragCenter(startCenter)
          } else {
            setRightDragCenter(startCenter)
          }
        },
        onPanResponderMove: (_, gestureState) => {
          const currentState = stateRef.current
          const currentLabelCenters = currentState.labelCenters

          if (currentState.isUnlimited || currentLabelCenters.length === 0) {
            return
          }

          if (side === 'left') {
            const minCenterX = currentLabelCenters[0] ?? 0
            const rightCenterX =
              currentState.rightDragCenter ??
              currentLabelCenters[currentState.selectedEndIndex] ??
              minCenterX
            const currentX = dragStartCenterRef.current.left + gestureState.dx
            const nextCenterX = getClampedLeftCenter(currentX, minCenterX, rightCenterX)
            setLeftDragCenter(nextCenterX)
            return
          }

          const maxCenterX = currentLabelCenters[SEMESTER_VALUES.length - 1] ?? 0
          const leftCenterX =
            currentState.leftDragCenter ??
            currentLabelCenters[currentState.selectedStartIndex] ??
            maxCenterX
          const currentX = dragStartCenterRef.current.right + gestureState.dx
          const nextCenterX = getClampedRightCenter(currentX, leftCenterX, maxCenterX)
          setRightDragCenter(nextCenterX)
        },
        onPanResponderRelease: () => {
          const currentState = stateRef.current
          const currentLabelCenters = currentState.labelCenters

          if (currentLabelCenters.length === 0) {
            if (side === 'left') {
              setLeftDragCenter(null)
            } else {
              setRightDragCenter(null)
            }
            return
          }

          if (side === 'left') {
            const currentCenterX =
              currentState.leftDragCenter ??
              currentLabelCenters[currentState.selectedStartIndex] ??
              0
            const nearestIndex = getClosestSlotIndex(currentCenterX, currentLabelCenters)
            const nextStartIndex = clamp(nearestIndex, 0, currentState.selectedEndIndex - 1)

            setSelectedStartIndex(nextStartIndex)
            setLeftDragCenter(null)
            onChangeRef.current(indicesToValue(nextStartIndex, currentState.selectedEndIndex))
            return
          }

          const currentCenterX =
            currentState.rightDragCenter ??
            currentLabelCenters[currentState.selectedEndIndex] ??
            0
          const nearestIndex = getClosestSlotIndex(currentCenterX, currentLabelCenters)
          const nextEndIndex = clamp(
            nearestIndex,
            currentState.selectedStartIndex + 1,
            SEMESTER_VALUES.length - 1
          )

          setSelectedEndIndex(nextEndIndex)
          setRightDragCenter(null)
          onChangeRef.current(indicesToValue(currentState.selectedStartIndex, nextEndIndex))
        },
        onPanResponderTerminate: () => {
          if (side === 'left') {
            setLeftDragCenter(null)
            return
          }

          setRightDragCenter(null)
        },
      })

    return {
      leftThumbPanResponder: createPanResponder('left'),
      rightThumbPanResponder: createPanResponder('right'),
    }
  }, [])

  return {
    semesterValues: SEMESTER_VALUES,
    isUnlimited,
    handleToggleUnlimited,
    handleLabelLayout,
    trackStart,
    trackWidth,
    selectedStartX,
    selectedEndX,
    selectedTrackWidth,
    leftThumbPanHandlers: leftThumbPanResponder.panHandlers,
    rightThumbPanHandlers: rightThumbPanResponder.panHandlers,
  }
}
