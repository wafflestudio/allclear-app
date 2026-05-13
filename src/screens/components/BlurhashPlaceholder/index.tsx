import React from 'react'
import { Platform, StyleProp, View, ViewStyle } from 'react-native'
import { Blurhash } from 'react-native-blurhash'
import type { BlurhashProps } from 'react-native-blurhash'

type Props = Pick<BlurhashProps, 'blurhash' | 'decodeWidth' | 'decodeHeight'> & {
	style?: StyleProp<ViewStyle>
}

const BlurhashPlaceholder = ({ blurhash, decodeWidth, decodeHeight, style }: Props) => {
	if (Platform.OS === 'android') {
		return <View style={[{ backgroundColor: '#D9DDE3' }, style]} />
	}

	return <Blurhash blurhash={blurhash} decodeWidth={decodeWidth} decodeHeight={decodeHeight} style={style} />
}

export default BlurhashPlaceholder
