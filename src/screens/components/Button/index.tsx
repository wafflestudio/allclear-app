import React from 'react'
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

type DisabledVariant = 'default' | 'light'

type Props = {
  label: string
  onPress: () => void
  variant?: ButtonVariant
  height?: number
  isSelected?: boolean
  disabled?: boolean
  disabledVariant?: DisabledVariant
  width?: number
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button = ({
  label,
  onPress,
  variant = 'primary',
  height,
  isSelected = false,
  disabled = false,
  disabledVariant = 'default',
  width,
  style,
  textStyle,
}: Props) => {
  const variantStyle = getVariantStyle(variant, isSelected, disabled, disabledVariant)

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
      style={({ pressed }) => [containerStyle, pressed && { opacity: 0.7 }]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={labelStyle}>{label}</Text>
    </Pressable>
  )
}

const disabledVariantMap: Record<
  ButtonVariant,
  Record<DisabledVariant, keyof typeof variantStyles>
> = {
  primary: { default: 'primaryDisabled', light: 'primaryDisabledLight' },
  outline: { default: 'outlineDisabled', light: 'outlineDisabled' },
  ghost: { default: 'ghostDisabled', light: 'ghostDisabled' },
}

const getVariantStyle = (
  variant: ButtonVariant,
  isSelected: boolean,
  disabled: boolean,
  disabledVariant: DisabledVariant
): { container: ViewStyle; text: TextStyle } => {
  if (isSelected) {
    return disabled ? variantStyles.primaryDisabled : variantStyles.primary
  }

  if (disabled) {
    return variantStyles[disabledVariantMap[variant][disabledVariant]]
  }

  return variantStyles[variant]
}

const borderedContainer: ViewStyle = {
  backgroundColor: 'transparent',
  borderWidth: 1,
}

const variantStyles = {
  primary: {
    container: { backgroundColor: '#874FFF' } as ViewStyle,
    text: { color: '#FFFFFF' } as TextStyle,
  },
  primaryDisabled: {
    container: { backgroundColor: '#C1C1C1' } as ViewStyle,
    text: { color: '#FFFFFF' } as TextStyle,
  },
  primaryDisabledLight: {
    container: { backgroundColor: '#EAEAEA' } as ViewStyle,
    text: { color: '#C1C1C1' } as TextStyle,
  },
  outline: {
    container: { ...borderedContainer, borderColor: '#874FFF' } as ViewStyle,
    text: { color: '#874FFF' } as TextStyle,
  },
  outlineDisabled: {
    container: { ...borderedContainer, borderColor: '#C1C1C1' } as ViewStyle,
    text: { color: '#C1C1C1' } as TextStyle,
  },
  ghost: {
    container: { ...borderedContainer, borderColor: '#C1C1C1' } as ViewStyle,
    text: { color: '#C1C1C1' } as TextStyle,
  },
  ghostDisabled: {
    container: { ...borderedContainer, borderColor: '#E0E0E0' } as ViewStyle,
    text: { color: '#E0E0E0' } as TextStyle,
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

export default Button
