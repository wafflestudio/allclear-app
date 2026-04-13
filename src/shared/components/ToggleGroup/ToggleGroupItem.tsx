import { useEffect } from 'react'
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const SELECTED_BACKGROUND_COLOR = '#874FFF'
const UNSELECTED_BACKGROUND_COLOR = 'rgba(255, 255, 255, 0)'

export type ToggleGroupItemProps = {
  label: string
  selected: boolean
  onPress: () => void
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}

export const ToggleGroupItem = ({
  label,
  selected,
  onPress,
  disabled,
  style,
}: ToggleGroupItemProps) => {
  const progress = useSharedValue(selected ? 1 : 0)

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 160 })
  }, [progress, selected])

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [UNSELECTED_BACKGROUND_COLOR, SELECTED_BACKGROUND_COLOR]
    ),
  }))

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={[styles.container, selected ? styles.selected : styles.unselected, animatedStyle, style]}
    >
      <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>
        {label}
      </Text>
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    paddingTop: 7,
    paddingBottom: 8,
    paddingHorizontal: 15,
  },
  selected: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unselected: {
    borderWidth: 1,
    borderColor: '#C1C1C1',
  },
  text: {
    fontWeight: '600',
    fontSize: 10,
    lineHeight: 10,
  },
  textSelected: {
    color: '#FFFFFF',
  },
  textUnselected: {
    color: '#C1C1C1',
  },
})
