import Config from 'react-native-config'

type Profile = 'dev' | 'staging' | 'prod'

const API_SERVER_BASE_URL = Config.API_SERVER_BASE_URL
const ONESIGNAL_APP_ID = Config.ONESIGNAL_APP_ID

;(function validateEnv() {
	const message = [
		['API_SERVER_BASE_URL', API_SERVER_BASE_URL],
		['ONESIGNAL_APP_ID', ONESIGNAL_APP_ID],
	]
		.filter(it => !it[1])
		.map(([name, value]) => `Invalid environment variable ${name}: ${value}`)
		.join('\n')

	if (message) {
		throw new Error(message)
	}
})()
export const ENV = {
	PROFILE: Config.PROFILE as Profile,
	IS_PRODUCTION: !__DEV__,
	API_SERVER_BASE_URL: API_SERVER_BASE_URL,
	ONESIGNAL_APP_ID: Config.ONESIGNAL_APP_ID || '',
	WEB_URL: Config.WEB_URL || '',
}
