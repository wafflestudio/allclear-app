import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native'

const COLORS = {
  purple: '#874FFF',
  purplePressed: '#6C40CA',
  white: '#FFFFFF',
  gray300: '#C1C1C1',
  gray200: '#E0E0E0',
  gray100: '#EAEAEA',
} as const

export type ButtonVariant = 'primary' | 'outline' | 'ghost'

export type ButtonProps = {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  height?: number
	width?: number
  isSelected?: boolean
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  height,
  isSelected = false,
  disabled = false,
  width,
  style,
  textStyle,
}: ButtonProps) => {
  const variantStyle = getVariantStyle(variant, isSelected, disabled)

  const containerStyle: ViewStyle[] = [
    styles.base,
    variantStyle.container,
    height !== undefined && { height },
    width !== undefined ? { width } : { flex: 1 },
    style,
  ].filter((s): s is ViewStyle => !!s)

  const labelStyle: TextStyle[] = [
    styles.label,
    variantStyle.text,
    textStyle,
  ].filter((s): s is TextStyle => !!s)

  return (
    <Pressable
      style={({ pressed }) => [
        containerStyle,
        pressed && (variant === 'primary' ? { backgroundColor: COLORS.purplePressed } : { opacity: 0.7 }),
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={labelStyle}>{label}</Text>
    </Pressable>
  )
}

const disabledVariantMap: Record<ButtonVariant, keyof typeof variantStyles> = {
  primary: 'primaryDisabled',
  outline: 'outlineDisabled',
  ghost: 'ghostDisabled',
}

const getVariantStyle = (
  variant: ButtonVariant,
  isSelected: boolean,
  disabled: boolean
): { container: ViewStyle; text: TextStyle } => {
  if (isSelected) {
    return disabled ? variantStyles.primaryDisabled : variantStyles.primary
  }

  if (disabled) {
    return variantStyles[disabledVariantMap[variant]]
  }

  return variantStyles[variant]
}

const borderedContainer: ViewStyle = {
  backgroundColor: 'transparent',
  borderWidth: 1,
}

const variantStyles = {
  primary: {
    container: { backgroundColor: COLORS.purple } as ViewStyle,
    text: { color: COLORS.white } as TextStyle,
  },
  primaryDisabled: {
    container: { backgroundColor: COLORS.gray100 } as ViewStyle,
    text: { color: COLORS.gray300 } as TextStyle,
  },
  outline: {
    container: { ...borderedContainer, borderColor: COLORS.purple } as ViewStyle,
    text: { color: COLORS.purple } as TextStyle,
  },
  // TODO: outlineDisabled와 ghost의 borderColor가 동일함 (피그마 기준). 검토 필요
  outlineDisabled: {
    container: { ...borderedContainer, borderColor: COLORS.gray300 } as ViewStyle,
    text: { color: COLORS.gray300 } as TextStyle,
  },
  ghost: {
    container: { ...borderedContainer, borderColor: COLORS.gray300 } as ViewStyle,
    text: { color: COLORS.gray300 } as TextStyle,
  },
  ghostDisabled: {
    container: { ...borderedContainer, borderColor: COLORS.gray200 } as ViewStyle,
    text: { color: COLORS.gray200 } as TextStyle,
  },
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingHorizontal: 50,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
})
