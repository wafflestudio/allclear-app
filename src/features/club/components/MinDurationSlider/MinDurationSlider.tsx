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
  MIN_DURATION_OPTIONS,
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
    labelWidths,
    stepCenters,
    selectedValues,
    handleToggleStep,
    handleLabelsContainerLayout,
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

          {MIN_DURATION_OPTIONS.slice(0, -1).map((option, index) => {
            const nextOption = MIN_DURATION_OPTIONS[index + 1]
            const startCenterX = stepCenters[index]
            const endCenterX = stepCenters[index + 1]

            if (
              nextOption === undefined ||
              !selectedValueSet.has(option.value) ||
              !selectedValueSet.has(nextOption.value) ||
              startCenterX === undefined ||
              endCenterX === undefined
            ) {
              return null
            }

            return (
              <View
                key={`${option.value}-${nextOption.value}`}
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

          {stepCenters.map((centerX, index) => {
            const option = MIN_DURATION_OPTIONS[index]

            if (option === undefined) {
              return null
            }

            return (
              <MinDurationSliderStepDot
                key={option.value}
                centerX={centerX}
                onPress={() => handleToggleStep(option.value)}
                selected={selectedValueSet.has(option.value)}
              />
            )
          })}
        </View>

        <View onLayout={handleLabelsContainerLayout} style={styles.labelsRow}>
          {MIN_DURATION_OPTIONS.map((option, index) => (
            <View
              key={option.value}
              onLayout={event => handleLabelLayout(index, event)}
              style={[
                styles.labelSlot,
                index === 0
                  ? styles.firstLabelSlot
                  : index === MIN_DURATION_OPTIONS.length - 1
                    ? styles.lastLabelSlot
                    : {
                        left:
                          (stepCenters[index] ?? 0) - ((labelWidths[index] ?? 0) / 2),
                      },
              ]}
            >
              <Text style={styles.labelText}>{option.label}</Text>
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
    width: '100%',
  },
  trackArea: {
    height: THUMB_SIZE,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
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
    position: 'relative',
    width: '100%',
  },
  labelSlot: {
    alignItems: 'center',
    position: 'absolute',
    top: 0,
  },
  firstLabelSlot: {
    left: 0,
  },
  lastLabelSlot: {
    right: 0,
  },
  labelText: {
    ...typography.bodySRegular,
    color: Colors.BODYTEXT_SUB,
    textAlign: 'center',
  },
})
