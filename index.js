import { AppRegistry }                 from 'react-native'

import { name as appName }             from './app.json'
import RootErrorBoundary               from './src/RootErrorBoundary'

AppRegistry.registerComponent(appName, () => RootErrorBoundary)
