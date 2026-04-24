import { useCallback, useState } from 'react'
import type {
  ToggleGroupOption,
  ToggleGroupSelectionMode,
  ToggleGroupValue,
} from './types'

export type UseToggleGroupParams = {
  allOption?: ToggleGroupOption
  selectionMode?: ToggleGroupSelectionMode
  value?: ToggleGroupValue
  defaultValue?: ToggleGroupValue
  onChange?: (value: ToggleGroupValue) => void
}

export type UseToggleGroupReturn = {
  selectedValues: ToggleGroupValue
  isSelected: (value: string) => boolean
  toggle: (value: string) => void
  reset: () => void
}

const normalizeValue = ({
  selectedValues,
  selectionMode,
  allOption,
}: {
  selectedValues: ToggleGroupValue
  selectionMode: ToggleGroupSelectionMode
  allOption?: ToggleGroupOption
}): ToggleGroupValue => {
  const uniqueValues = [...new Set(selectedValues)]
  const normalizedValues = allOption
    ? uniqueValues.filter(selectedValue => selectedValue !== allOption.value)
    : uniqueValues

  if (normalizedValues.length === 0) {
    return []
  }

  if (selectionMode === 'single') {
    return normalizedValues.slice(0, 1)
  }

  return normalizedValues
}

const getNextValue = ({
  selectedValues,
  value,
  allOption,
  selectionMode,
}: {
  selectedValues: ToggleGroupValue
  value: string
  allOption?: ToggleGroupOption
  selectionMode: ToggleGroupSelectionMode
}): ToggleGroupValue => {
  if (allOption && value === allOption.value) {
    return []
  }

  const isCurrentlySelected = selectedValues.includes(value)

  if (selectionMode === 'single') {
    if (isCurrentlySelected) {
      return []
    }

    return [value]
  }

  if (isCurrentlySelected) {
    return selectedValues.filter(selectedValue => selectedValue !== value)
  }

  const newValues = [...selectedValues, value]

  return newValues
}

export const useToggleGroup = ({
  allOption,
  selectionMode = 'multiple',
  value: controlledValue,
  defaultValue,
  onChange,
}: UseToggleGroupParams): UseToggleGroupReturn => {
  const initialValue = normalizeValue({
    selectedValues: defaultValue ?? [],
    selectionMode,
    allOption,
  })
  const [internalSelectedValues, setInternalSelectedValues] = useState<ToggleGroupValue>(
    initialValue
  )

  const selectedValues = normalizeValue({
    selectedValues: controlledValue ?? internalSelectedValues,
    selectionMode,
    allOption,
  })

  const updateValue = useCallback(
    (nextValue: ToggleGroupValue) => {
      if (controlledValue === undefined) {
        setInternalSelectedValues(nextValue)
      }

      onChange?.(nextValue)
    },
    [controlledValue, onChange]
  )

  const isSelected = useCallback(
    (value: string) => {
      if (allOption && value === allOption.value) {
        return selectedValues.length === 0
      }

      return selectedValues.includes(value)
    },
    [allOption, selectedValues]
  )

  const toggle = useCallback(
    (nextSelectedValue: string) => {
      const nextValue = getNextValue({
        selectedValues,
        value: nextSelectedValue,
        allOption,
        selectionMode,
      })

      updateValue(nextValue)
    },
    [allOption, selectedValues, selectionMode, updateValue]
  )

  const reset = useCallback(() => {
    updateValue([])
  }, [updateValue])

  return { selectedValues, isSelected, toggle, reset }
}
