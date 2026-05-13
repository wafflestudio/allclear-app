import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from '@/shared/constants/colors'
import { ms } from '@/shared/utils/scale'
import { THUMB_SIZE } from './useMinDurationSlider'

type MinDurationSliderStepDotProps = {
  centerX: number
  selected: boolean
}

const STEP_DOT_SIZE = ms(12)
const STEP_DOT_SELECTED_SIZE = ms(14)
const STEP_DOT_BORDER_WIDTH = 2
const STEP_DOT_INNER_SIZE = ms(8)

export const MinDurationSliderStepDot = ({
  centerX,
  selected,
}: MinDurationSliderStepDotProps) => (
  <View
    pointerEvents="none"
    style={[
      styles.stepDot,
      selected && styles.stepDotSelected,
      {
        left: centerX - (selected ? STEP_DOT_SELECTED_SIZE : STEP_DOT_SIZE) / 2,
      },
    ]}
  >
    {selected ? <View style={styles.stepDotInner} /> : null}
  </View>
)

const styles = StyleSheet.create({
  stepDot: {
    backgroundColor: Colors.WHITE,
    borderColor: Colors.GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: STEP_DOT_SIZE / 2,
    borderWidth: STEP_DOT_BORDER_WIDTH,
    height: STEP_DOT_SIZE,
    position: 'absolute',
    top: (THUMB_SIZE - STEP_DOT_SIZE) / 2,
    width: STEP_DOT_SIZE,
  },
  stepDotSelected: {
    borderColor: Colors.POINTCOLOR,
    borderRadius: STEP_DOT_SELECTED_SIZE / 2,
    height: STEP_DOT_SELECTED_SIZE,
    top: (THUMB_SIZE - STEP_DOT_SELECTED_SIZE) / 2,
    width: STEP_DOT_SELECTED_SIZE,
  },
  stepDotInner: {
    backgroundColor: Colors.POINTCOLOR,
    borderRadius: STEP_DOT_INNER_SIZE / 2,
    height: STEP_DOT_INNER_SIZE,
    width: STEP_DOT_INNER_SIZE,
  },
})
