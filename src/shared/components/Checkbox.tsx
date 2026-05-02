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
import { Colors } from '@/shared/constants/colors'

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
          color={Colors.POINTCOLOR}
          name={checked ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
          size={12}
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
    gap: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    alignItems: 'center',
    height: 12,
    justifyContent: 'center',
    width: 12,
  },
  label: {
    color: Colors.POINTCOLOR,
    fontFamily: 'Pretendard',
    fontSize: 12,
    fontWeight: '600',
    includeFontPadding: false,
    lineHeight: 12,
    marginTop: 2,
  },
  labelChecked: {
    color: Colors.POINTCOLOR,
  },
})

export default Checkbox
