export type ToggleGroupOption = {
  label: string
  value: string
  disabled?: boolean
}

export type ToggleGroupAllItem = {
  label: string
  disabled?: boolean
}

export type ToggleGroupSelectionMode = 'single' | 'multiple'

export type ToggleGroupSelection =
  | { kind: 'all' }
  | { kind: 'none' }
  | { kind: 'values'; values: string[] }
