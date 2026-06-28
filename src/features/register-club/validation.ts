// Backend requires `sns`/`image_uri` to satisfy `format: uri`. Users often type a
export const normalizeUrl = (raw: string): string => {
	const trimmed = raw.trim()
	if (!trimmed) {
		return ''
	}
	return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

// Valid once normalized: requires an https host
export const isValidUrl = (raw: string): boolean => URL_PATTERN.test(normalizeUrl(raw))
