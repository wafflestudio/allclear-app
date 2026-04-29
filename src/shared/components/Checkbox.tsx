import React from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  TextStyle,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const COLORS = {
  purple: '#874FFF',
} as const

type Props = {
  label: string
  checked: boolean
  onPress: () => void
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

const Checkbox = ({
  label,
  checked,
  onPress,
  style,
  textStyle,
}: Props) => {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed, style]}
    >
      <View style={styles.iconContainer}>
        <Icon
          color={COLORS.purple}
          name={checked ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
          size={10}
        />
      </View>
      <Text style={[styles.label, checked && styles.labelChecked, textStyle]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    alignItems: 'center',
    height: 10,
    justifyContent: 'center',
    width: 10,
  },
  label: {
    color: COLORS.purple,
    fontFamily: 'Pretendard',
    fontSize: 10,
    fontWeight: '600',
    includeFontPadding: false,
    lineHeight: 10,
    marginTop: 1,
  },
  labelChecked: {
    color: COLORS.purple,
  },
})

export default Checkbox
