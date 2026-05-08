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
import { ms, vs } from '@/shared/utils/scale'
import { MinDurationSliderHeader } from './MinDurationSliderHeader'
import {
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
const THUMB_HIT_SIZE = ms(28)

export const MinDurationSlider = ({
  style,
  value,
  onChange,
}: MinDurationSliderProps) => {
  const {
    semesterValues,
    isUnlimited,
    handleToggleUnlimited,
    handleLabelLayout,
    trackStart,
    trackWidth,
    selectedStartX,
    selectedEndX,
    selectedTrackWidth,
    leftThumbPanHandlers,
    rightThumbPanHandlers,
  } = useMinDurationSlider({ value, onChange })

  return (
    <View style={[styles.container, style]}>
      <MinDurationSliderHeader
        checked={isUnlimited}
        onToggle={handleToggleUnlimited}
      />

      <View pointerEvents={isUnlimited ? 'none' : 'auto'} style={styles.sliderArea}>
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

          <View
            style={[
              styles.selectedTrack,
              isUnlimited && styles.selectedTrackDisabled,
              {
                left: selectedStartX,
                width: selectedTrackWidth,
              },
            ]}
          />

          <View
            {...leftThumbPanHandlers}
            style={[
              styles.thumbHitbox,
              {
                left: selectedStartX - THUMB_HIT_SIZE / 2,
              },
            ]}
          >
            <View style={[styles.thumb, isUnlimited && styles.thumbDisabled]} />
          </View>

          <View
            {...rightThumbPanHandlers}
            style={[
              styles.thumbHitbox,
              {
                left: selectedEndX - THUMB_HIT_SIZE / 2,
              },
            ]}
          >
            <View style={[styles.thumb, isUnlimited && styles.thumbDisabled]} />
          </View>
        </View>

        <View style={styles.labelsRow}>
          {semesterValues.map((semesterValue, index) => (
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
  selectedTrack: {
    backgroundColor: Colors.POINTCOLOR,
    borderRadius: TRACK_HEIGHT / 2,
    height: TRACK_HEIGHT,
    position: 'absolute',
    top: (THUMB_SIZE - TRACK_HEIGHT) / 2,
  },
  selectedTrackDisabled: {
    backgroundColor: Colors.GRAY,
  },
  thumbHitbox: {
    alignItems: 'center',
    height: THUMB_HIT_SIZE,
    justifyContent: 'center',
    position: 'absolute',
    top: (THUMB_SIZE - THUMB_HIT_SIZE) / 2,
    width: THUMB_HIT_SIZE,
    zIndex: 1,
  },
  thumb: {
    backgroundColor: Colors.BACKGROUND_SUB,
    borderColor: Colors.POINTCOLOR,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    height: THUMB_SIZE,
    width: THUMB_SIZE,
  },
  thumbDisabled: {
    borderColor: Colors.GRAY,
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
