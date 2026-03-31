import React from 'react'
import { Modal, Pressable, View, StyleSheet, Text } from 'react-native'
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
  onClose: () => void
  title: string
  description: string
  buttons: [ModalButton] | [ModalButton, ModalButton]
}

const defaultVariants: Record<1 | 2, ButtonVariant[]> = {
  1: ['outline'],
  2: ['outline', 'primary'],
}

const AlertModal = ({ visible, onClose, title, description, buttons }: Props) => {
  const variants = defaultVariants[buttons.length === 1 ? 1 : 2]

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
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
        </Pressable>
      </Pressable>
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
  },
  container: {
    width: '100%',
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.FYI_BLACK,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.FYI_BLACK,
    textAlign: 'center',
    marginTop: 12,
  },
  buttonArea: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
})

export default AlertModal
