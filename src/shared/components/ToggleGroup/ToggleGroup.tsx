import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { ToggleGroupItem } from './ToggleGroupItem'
import type {
  ToggleGroupAllItem,
  ToggleGroupOption,
  ToggleGroupSelectionMode,
  ToggleGroupSelection,
} from './types'
import { useToggleGroup } from './useToggleGroup'

export type ToggleGroupProps = {
  options: ToggleGroupOption[]
  allItem?: ToggleGroupAllItem
  selectionMode?: ToggleGroupSelectionMode
  value?: ToggleGroupSelection
  defaultValue?: ToggleGroupSelection
  onChange?: (value: ToggleGroupSelection) => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  itemStyle?: StyleProp<ViewStyle>
}

export const ToggleGroup = ({
  options,
  allItem,
  selectionMode,
  value,
  defaultValue,
  onChange,
  disabled,
  style,
  itemStyle,
}: ToggleGroupProps) => {
  const { isAllSelected, isSelected, selectAll, toggle } = useToggleGroup({
    selectionMode,
    value,
    defaultValue,
    onChange,
  })

  return (
    <View style={[styles.container, style]}>
      {allItem ? (
        <ToggleGroupItem
          key="$all"
          label={allItem.label}
          selected={isAllSelected}
          onPress={selectAll}
          disabled={disabled || allItem.disabled}
          style={itemStyle}
        />
      ) : null}
      {options.map(option => (
        <ToggleGroupItem
          key={option.value}
          label={option.label}
          selected={isSelected(option.value)}
          onPress={() => toggle(option.value)}
          disabled={disabled || option.disabled}
          style={itemStyle}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
})
