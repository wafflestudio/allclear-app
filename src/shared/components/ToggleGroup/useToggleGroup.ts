import { useCallback, useState } from 'react'
import type {
  ToggleGroupOption,
  ToggleGroupSelectionMode,
  ToggleGroupValue,
} from './types'

export type UseToggleGroupParams = {
  allOption?: ToggleGroupOption
  selectionMode?: ToggleGroupSelectionMode
  allowEmptySelection?: boolean
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

  if (uniqueValues.length === 0) {
    return []
  }

  if (allOption && uniqueValues.includes(allOption.value)) {
    return [allOption.value]
  }

  if (selectionMode === 'single') {
    return uniqueValues.slice(0, 1)
  }

  return uniqueValues
}

const getNextValue = ({
  selectedValues,
  value,
  allOption,
  selectionMode,
  allowEmptySelection,
}: {
  selectedValues: ToggleGroupValue
  value: string
  allOption?: ToggleGroupOption
  selectionMode: ToggleGroupSelectionMode
  allowEmptySelection: boolean
}): ToggleGroupValue => {
  if (allOption && value === allOption.value) {
    return [allOption.value]
  }

  const isCurrentlySelected = selectedValues.includes(value)
  const withoutAll = allOption
    ? selectedValues.filter(selectedValue => selectedValue !== allOption.value)
    : selectedValues

  if (selectionMode === 'single') {
    if (isCurrentlySelected) {
      return allowEmptySelection ? [] : [value]
    }

    return [value]
  }

  if (isCurrentlySelected) {
    const newValues = withoutAll.filter(selectedValue => selectedValue !== value)

    if (newValues.length === 0 && !allowEmptySelection && allOption) {
      return [allOption.value]
    }

    if (newValues.length === 0 && !allowEmptySelection) {
      return selectedValues
    }

    return newValues
  }

  const newValues = [...withoutAll, value]

  return newValues
}

export const useToggleGroup = ({
  allOption,
  selectionMode = 'multiple',
  allowEmptySelection = allOption === undefined,
  value: controlledValue,
  defaultValue,
  onChange,
}: UseToggleGroupParams): UseToggleGroupReturn => {
  const initialValue = normalizeValue({
    selectedValues: defaultValue ?? (allOption && !allowEmptySelection ? [allOption.value] : []),
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
    (value: string) => selectedValues.includes(value),
    [selectedValues]
  )

  const toggle = useCallback(
    (nextSelectedValue: string) => {
      const nextValue = getNextValue({
        selectedValues,
        value: nextSelectedValue,
        allOption,
        selectionMode,
        allowEmptySelection,
      })

      updateValue(nextValue)
    },
    [allOption, allowEmptySelection, selectedValues, selectionMode, updateValue]
  )

  const reset = useCallback(() => {
    updateValue([])
  }, [updateValue])

  return { selectedValues, isSelected, toggle, reset }
}
