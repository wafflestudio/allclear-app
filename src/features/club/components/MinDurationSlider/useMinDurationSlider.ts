import { useCallback, useRef, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { ms } from '@/shared/utils/scale'

export const THUMB_SIZE = ms(10)
export const SEMESTER_VALUES = [1, 2, 3, 4] as const

export type MinDurationValue = number[]

type UseMinDurationSliderOptions = {
  value: MinDurationValue
  onChange: (value: MinDurationValue) => void
}

const getValidSelectedValues = (value: MinDurationValue) => {
  if (value.length === 0) {
    return []
  }

  return Array.from(
    new Set(
      value.filter(semesterValue =>
        SEMESTER_VALUES.includes(semesterValue as (typeof SEMESTER_VALUES)[number])
      )
    )
  )
    .sort((left, right) => left - right)
}

export const useMinDurationSlider = ({ value, onChange }: UseMinDurationSliderOptions) => {
  const selectedValues = getValidSelectedValues(value)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const [labelCenters, setLabelCenters] = useState<number[]>([])

  const handleToggleStep = useCallback((semesterValue: number) => {
    const nextSelectedValues = selectedValues.includes(semesterValue)
      ? selectedValues.filter(selectedValue => selectedValue !== semesterValue)
      : [...selectedValues, semesterValue].sort((left, right) => left - right)

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
  const trackEnd = labelCenters[SEMESTER_VALUES.length - 1] ?? 0
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
