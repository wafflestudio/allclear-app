import React from 'react'
import { Modal, View, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native'
import { Colors } from '../../../constants/colors'
import Button from '../Button'

type ButtonVariant = 'primary' | 'outline' | 'ghost'

export type ModalButton = {
  label: string
  onPress: () => void
  variant?: ButtonVariant
}

type Props = {
  visible: boolean
  title: string
  description: string
  buttons: [ModalButton] | [ModalButton, ModalButton]
}

const defaultVariants: Record<1 | 2, ButtonVariant[]> = {
  1: ['outline'],
  2: ['outline', 'primary'],
}

const AlertModal = ({ visible, title, description, buttons }: Props) => {
  const variants = defaultVariants[buttons.length as 1 | 2]

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <View style={styles.buttonArea}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                label={button.label}
                onPress={button.onPress}
                variant={button.variant ?? variants[index]}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.DIM_BLACK,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  } as ViewStyle,
  container: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
  } as ViewStyle,
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.FYI_BLACK,
    textAlign: 'center',
  } as TextStyle,
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.FYI_GRAY_600,
    textAlign: 'center',
    marginTop: 12,
  } as TextStyle,
  buttonArea: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  } as ViewStyle,
})

export default AlertModal
