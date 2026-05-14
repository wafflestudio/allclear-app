import { useCallback, useRef, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { ms } from '@/shared/utils/scale'

export const THUMB_SIZE = ms(10)
export const MIN_DURATION_OPTIONS = [
  { value: '0', label: '없음(0학기)' },
  { value: '1', label: '1학기' },
  { value: '2', label: '2학기' },
  { value: '2_plus', label: '2학기 이상' },
] as const

export type MinDurationStepValue = (typeof MIN_DURATION_OPTIONS)[number]['value']
export type MinDurationValue = MinDurationStepValue[]

type UseMinDurationSliderOptions = {
  value: MinDurationValue
  onChange: (value: MinDurationValue) => void
}

const MIN_DURATION_ORDER = MIN_DURATION_OPTIONS.map(option => option.value)

const getValidSelectedValues = (value: MinDurationValue) => {
  if (value.length === 0) {
    return []
  }

  return Array.from(
    new Set(
      value.filter(durationValue =>
        MIN_DURATION_ORDER.includes(durationValue as MinDurationStepValue)
      )
    )
  )
    .sort(
      (left, right) =>
        MIN_DURATION_ORDER.indexOf(left as MinDurationStepValue) -
        MIN_DURATION_ORDER.indexOf(right as MinDurationStepValue)
    )
}

export const useMinDurationSlider = ({ value, onChange }: UseMinDurationSliderOptions) => {
  const selectedValues = getValidSelectedValues(value)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [labelCenters, setLabelCenters] = useState<number[]>([])

  const handleToggleStep = useCallback((durationValue: MinDurationStepValue) => {
    const nextSelectedValues = selectedValues.includes(durationValue)
      ? selectedValues.filter(selectedValue => selectedValue !== durationValue)
      : [...selectedValues, durationValue].sort(
          (left, right) =>
            MIN_DURATION_ORDER.indexOf(left as MinDurationStepValue) -
            MIN_DURATION_ORDER.indexOf(right as MinDurationStepValue)
        )

    onChangeRef.current(nextSelectedValues)
  }, [selectedValues])

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
  const trackEnd = labelCenters[MIN_DURATION_OPTIONS.length - 1] ?? 0
  const trackWidth = Math.max(trackEnd - trackStart, 0)

  return {
    labelCenters,
    selectedValues,
    handleToggleStep,
    handleLabelLayout,
    trackStart,
    trackWidth,
  }
}
