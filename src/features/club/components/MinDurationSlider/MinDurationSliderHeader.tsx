import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Checkbox from '@/shared/components/Checkbox'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { s } from '@/shared/utils/scale'

type MinDurationSliderHeaderProps = {
  checked: boolean
  onToggle: () => void
}

export const MinDurationSliderHeader = ({
  checked,
  onToggle,
}: MinDurationSliderHeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>최소활동기간</Text>
      <Checkbox
        checked={checked}
        label="제한 없음"
        onPressIn={onToggle}
        style={styles.checkbox}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...typography.bodySMedium,
    color: Colors.BODYTEXT_SUB,
  },
  checkbox: {
    gap: s(3),
  },
})
