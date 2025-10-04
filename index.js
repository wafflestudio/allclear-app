import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import codePush from 'react-native-code-push'
import { ENV } from './src/constants/ENV'
import 'react-native-url-polyfill/auto'

let app = App

if (ENV.IS_PRODUCTION) {
	app = codePush({
		checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
		installMode: codePush.InstallMode.ON_NEXT_RESTART,
		mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
		rollbackRetryOptions: {
			delayInHours: 6,
			maxRetryAttempts: 100_000_000, // 코드푸시 업데이트를 실패하더라도 계속 재시도하도록 의도적으로 설정한 값
		},
	})(app)
}

AppRegistry.registerComponent(appName, () => app)
