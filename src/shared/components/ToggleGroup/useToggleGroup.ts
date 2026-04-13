import { useCallback, useState } from 'react'
import type { ToggleGroupOption, ToggleGroupValue } from './types'

export type UseToggleGroupParams = {
  allOption?: ToggleGroupOption
  value?: ToggleGroupValue
  defaultValue?: ToggleGroupValue
  onChange?: (value: ToggleGroupValue) => void
}

export type UseToggleGroupReturn = {
  selectedValues: ToggleGroupValue
  isSelected: (value: string) => boolean
  toggle: (value: string) => void
}

const getNextValue = ({
  selectedValues,
  value,
  allOption,
}: {
  selectedValues: ToggleGroupValue
  value: string
  allOption?: ToggleGroupOption
}): ToggleGroupValue => {
  if (allOption && value === allOption.value) {
    return [allOption.value]
  }

  const isCurrentlySelected = selectedValues.includes(value)
  const withoutAll = allOption
    ? selectedValues.filter(selectedValue => selectedValue !== allOption.value)
    : selectedValues

  if (isCurrentlySelected) {
    const newValues = withoutAll.filter(selectedValue => selectedValue !== value)

    if (newValues.length === 0 && allOption) {
      return [allOption.value]
    }

    return newValues
  }

  const newValues = [...withoutAll, value]

  return newValues
}

export const useToggleGroup = ({
  allOption,
  value: controlledValue,
  defaultValue,
  onChange,
}: UseToggleGroupParams): UseToggleGroupReturn => {
  const [internalSelectedValues, setInternalSelectedValues] = useState<ToggleGroupValue>(
    defaultValue ?? (allOption ? [allOption.value] : [])
  )

  const selectedValues = controlledValue ?? internalSelectedValues

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
      })

      if (controlledValue === undefined) {
        setInternalSelectedValues(nextValue)
      }

      onChange?.(nextValue)
    },
    [allOption, controlledValue, onChange, selectedValues]
  )

  return { selectedValues, isSelected, toggle }
}
