import { TextStyle } from 'react-native'
import { ms, vs } from '@/shared/utils/scale'

const base = (fontSize: number, fontWeight: TextStyle['fontWeight'], lineHeight?: number): TextStyle => ({
	fontFamily: 'Pretendard',
	fontSize: ms(fontSize),
	fontWeight,
	...(lineHeight ? { lineHeight: vs(lineHeight) } : {}),
})

export const typography = {
	// Header
	headerXXLSemibold: base(25, '600'),
	headerXL: base(20, '700'),
	headerL: base(16, '700'),
	headerXXL: base(25, '700', 30),
	headerXLSemibold: base(20, '600', 24),
	// Body
	bodyXSSemibold: base(10, '600', 14),
	bodySRegular: base(12, '400', 18),
	bodySMedium: base(12, '500'),
	bodySSemibold: base(12, '600', 14),
	bodySSmallSemibold: base(11, '600', 14),
	bodySSmallMedium: base(11, '500', 14),
	bodyMRegular: base(14, '400'),
	bodyMSemibold: base(14, '600'),
	bodyMMedium: base(14, '500'),
}
