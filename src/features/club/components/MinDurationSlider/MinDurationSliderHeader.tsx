import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
export const MinDurationSliderHeader = () => (
  <View style={styles.header}>
    <Text style={styles.title}>최소활동기간</Text>
  </View>
)

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-start',
  },
  title: {
    ...typography.bodySMedium,
    color: Colors.BODYTEXT_SUB,
  },
})
