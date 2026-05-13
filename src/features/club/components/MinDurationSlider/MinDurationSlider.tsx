import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { Colors } from '@/shared/constants/colors'
import { typography } from '@/shared/constants/typography'
import { vs } from '@/shared/utils/scale'
import { MinDurationSliderHeader } from './MinDurationSliderHeader'
import { MinDurationSliderStepDot } from './MinDurationSliderStepDot'
import {
  SEMESTER_VALUES,
  THUMB_SIZE,
  useMinDurationSlider,
  type MinDurationValue,
} from './useMinDurationSlider'

export type MinDurationSliderProps = {
  style?: StyleProp<ViewStyle>
  value: MinDurationValue
  onChange: (value: MinDurationValue) => void
}

const TRACK_HEIGHT = vs(4)

export const MinDurationSlider = ({
  style,
  value,
  onChange,
}: MinDurationSliderProps) => {
  const {
    labelCenters,
    selectedValues,
    handleToggleStep,
    handleLabelLayout,
    trackStart,
    trackWidth,
  } = useMinDurationSlider({ value, onChange })

  const selectedValueSet = new Set(selectedValues)

  return (
    <View style={[styles.container, style]}>
      <MinDurationSliderHeader />

      <View style={styles.sliderArea}>
        <View style={styles.trackArea}>
          <View
            style={[
              styles.track,
              {
                left: trackStart,
                width: trackWidth,
              },
            ]}
          />

          {SEMESTER_VALUES.slice(0, -1).map((semesterValue, index) => {
            const nextSemesterValue = SEMESTER_VALUES[index + 1]
            const startCenterX = labelCenters[index]
            const endCenterX = labelCenters[index + 1]

            if (
              !selectedValueSet.has(semesterValue) ||
              !selectedValueSet.has(nextSemesterValue) ||
              startCenterX === undefined ||
              endCenterX === undefined
            ) {
              return null
            }

            return (
              <View
                key={`${semesterValue}-${nextSemesterValue}`}
                style={[
                  styles.connectedTrack,
                  {
                    left: startCenterX,
                    width: endCenterX - startCenterX,
                  },
                ]}
              />
            )
          })}

          {labelCenters.map((centerX, index) => {
            const semesterValue = SEMESTER_VALUES[index]

            if (semesterValue === undefined) {
              return null
            }

            return (
              <MinDurationSliderStepDot
                key={semesterValue}
                centerX={centerX}
                onPress={() => handleToggleStep(semesterValue)}
                selected={selectedValueSet.has(semesterValue)}
              />
            )
          })}
        </View>

        <View style={styles.labelsRow}>
          {SEMESTER_VALUES.map((semesterValue, index) => (
            <View
              key={semesterValue}
              onLayout={event => handleLabelLayout(index, event)}
              style={styles.labelSlot}
            >
              <Text style={styles.labelText}>{`${semesterValue}학기`}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: vs(10),
  },
  sliderArea: {
    gap: vs(10),
  },
  trackArea: {
    height: THUMB_SIZE,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    backgroundColor: Colors.GRAY,
    borderRadius: TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    position: 'absolute',
    top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
  },
  connectedTrack: {
    backgroundColor: Colors.POINTCOLOR,
    borderRadius: TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    position: 'absolute',
    top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelSlot: {
    alignItems: 'center',
  },
  labelText: {
    ...typography.bodySRegular,
    color: Colors.BODYTEXT_SUB,
    textAlign: 'center',
  },
})
