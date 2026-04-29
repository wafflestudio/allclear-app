export type SearchFilterToggleGroupOption = {
  label: string
  value: string
  disabled?: boolean
}

export type SearchFilterToggleGroupAllItem = {
  label: string
  disabled?: boolean
}

export type SearchFilterToggleGroupSelectionMode = 'single' | 'multiple'

export type SearchFilterToggleGroupSelection =
  | { kind: 'all' }
  | { kind: 'none' }
  | { kind: 'values'; values: string[] }
