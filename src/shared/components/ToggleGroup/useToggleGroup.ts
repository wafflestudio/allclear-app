import { useCallback, useState } from 'react'
import type { ToggleGroupSelection, ToggleGroupSelectionMode } from './types'

export type UseToggleGroupParams = {
  selectionMode?: ToggleGroupSelectionMode
  value?: ToggleGroupSelection
  defaultValue?: ToggleGroupSelection
  onChange?: (value: ToggleGroupSelection) => void
}

export type UseToggleGroupReturn = {
  selection: ToggleGroupSelection
  isAllSelected: boolean
  isSelected: (value: string) => boolean
  toggle: (value: string) => void
  selectAll: () => void
  reset: () => void
}

const NONE_SELECTION: ToggleGroupSelection = { kind: 'none' }
const ALL_SELECTION: ToggleGroupSelection = { kind: 'all' }

const normalizeSelection = ({
  selection,
  selectionMode,
}: {
  selection: ToggleGroupSelection
  selectionMode: ToggleGroupSelectionMode
}): ToggleGroupSelection => {
  if (selection.kind !== 'values') {
    return selection
  }

  const uniqueValues = [...new Set(selection.values)]

  if (uniqueValues.length === 0) {
    return NONE_SELECTION
  }

  if (selectionMode === 'single') {
    return {
      kind: 'values',
      values: uniqueValues.slice(0, 1),
    }
  }

  return {
    kind: 'values',
    values: uniqueValues,
  }
}

const getNextSelection = ({
  selection,
  value,
  selectionMode,
}: {
  selection: ToggleGroupSelection
  value: string
  selectionMode: ToggleGroupSelectionMode
}): ToggleGroupSelection => {
  if (selection.kind !== 'values') {
    return { kind: 'values', values: [value] }
  }

  const isCurrentlySelected = selection.values.includes(value)

  if (selectionMode === 'single') {
    if (isCurrentlySelected) {
      return NONE_SELECTION
    }

    return { kind: 'values', values: [value] }
  }

  if (isCurrentlySelected) {
    const nextValues = selection.values.filter(selectedValue => selectedValue !== value)

    if (nextValues.length === 0) {
      return NONE_SELECTION
    }

    return { kind: 'values', values: nextValues }
  }

  return {
    kind: 'values',
    values: [...selection.values, value],
  }
}

export const useToggleGroup = ({
  selectionMode = 'multiple',
  value: controlledValue,
  defaultValue,
  onChange,
}: UseToggleGroupParams): UseToggleGroupReturn => {
  const initialSelection = normalizeSelection({
    selection: defaultValue ?? NONE_SELECTION,
    selectionMode,
  })
  const [internalSelection, setInternalSelection] = useState<ToggleGroupSelection>(initialSelection)

  const selection = normalizeSelection({
    selection: controlledValue ?? internalSelection,
    selectionMode,
  })

  const updateSelection = useCallback(
    (nextSelection: ToggleGroupSelection) => {
      const normalizedSelection = normalizeSelection({
        selection: nextSelection,
        selectionMode,
      })

      if (controlledValue === undefined) {
        setInternalSelection(normalizedSelection)
      }

      onChange?.(normalizedSelection)
    },
    [controlledValue, onChange, selectionMode]
  )

  const isSelected = useCallback(
    (value: string) => selection.kind === 'values' && selection.values.includes(value),
    [selection]
  )

  const toggle = useCallback(
    (nextSelectedValue: string) => {
      const nextSelection = getNextSelection({
        selection,
        value: nextSelectedValue,
        selectionMode,
      })

      updateSelection(nextSelection)
    },
    [selection, selectionMode, updateSelection]
  )

  const selectAll = useCallback(() => {
    updateSelection(ALL_SELECTION)
  }, [updateSelection])

  const reset = useCallback(() => {
    updateSelection(NONE_SELECTION)
  }, [updateSelection])

  return {
    selection,
    isAllSelected: selection.kind === 'all',
    isSelected,
    toggle,
    selectAll,
    reset,
  }
}
