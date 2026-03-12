import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { ENV } from './src/constants/ENV'
import 'react-native-url-polyfill/auto'

let app = App

AppRegistry.registerComponent(appName, () => app)
