import React, { useState } from 'react'
import { TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native'

const COLORS = {
  black: '#000000',
  gray400: '#BDBDBD',
  gray300: '#C1C1C1',
} as const

type TextFieldBorderStyle = {
  width?: number
  color?: string
}

type TextFieldTextStyle = {
  color?: string
  font?: TextStyle
}

type TextFieldValidation = {
  validate?: (value: string) => boolean
  errorMessage?: string
}

type Props = {
  width?: number
  height?: number
  textAlign?: 'left' | 'center'
  border?: TextFieldBorderStyle
  placeholder?: string
  placeholderStyle?: TextFieldTextStyle
  textStyle?: TextFieldTextStyle
  validation?: TextFieldValidation
  onChangeText?: (value: string, isValid: boolean) => void
}

const TextField = ({
  width,
  height = 48,
  textAlign = 'left',
  border,
  placeholder,
  placeholderStyle,
  textStyle,
  validation,
  onChangeText,
}: Props) => {
  const [value, setValue] = useState('')

  const handleChangeText = (text: string) => {
    setValue(text)
    const isValid = validation?.validate ? validation.validate(text) : true
    onChangeText?.(text, isValid)
  }

  const containerStyle: ViewStyle[] = [
    styles.base,
    { height },
    { borderWidth: border?.width ?? 1 },
    { borderColor: border?.color ?? COLORS.gray300 },
    width !== undefined ? { width } : { flex: 1 },
  ]

  const inputStyle: TextStyle[] = [
    styles.text,
    { textAlign },
    { color: textStyle?.color ?? COLORS.black },
    textStyle?.font,
  ].filter((s): s is TextStyle => !!s)

  const placeholderColor = placeholderStyle?.color ?? COLORS.gray400

  return (
    <TextInput
      style={[containerStyle, inputStyle]}
      value={value}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      placeholderTextColor={placeholderColor}
    />
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
})

export default TextField
