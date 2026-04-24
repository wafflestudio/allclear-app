import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native'
import { ToggleGroupItem } from './ToggleGroupItem'
import type {
  ToggleGroupOption,
  ToggleGroupSelectionMode,
  ToggleGroupValue,
} from './types'
import { useToggleGroup } from './useToggleGroup'

export type ToggleGroupProps = {
  options: ToggleGroupOption[]
  allOption?: ToggleGroupOption
  selectionMode?: ToggleGroupSelectionMode
  value?: ToggleGroupValue
  defaultValue?: ToggleGroupValue
  onChange?: (value: ToggleGroupValue) => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  itemStyle?: StyleProp<ViewStyle>
}

export const ToggleGroup = ({
  options,
  allOption,
  selectionMode,
  value,
  defaultValue,
  onChange,
  disabled,
  style,
  itemStyle,
}: ToggleGroupProps) => {
  const { isSelected, toggle } = useToggleGroup({
    allOption,
    selectionMode,
    value,
    defaultValue,
    onChange,
  })
  const renderedOptions = allOption ? [allOption, ...options] : options

  return (
    <View style={[styles.container, style]}>
      {renderedOptions.map(option => (
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
