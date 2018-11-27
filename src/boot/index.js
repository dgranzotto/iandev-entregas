import consoleOutput from './console-output'
import localStorageCheck from './local-storage'
// import { axiosInterceptors } from '../interceptors/axios'
import appSetup from './app-setup'
import session from './session'

export default () => {
  return consoleOutput()
    .then(success => localStorageCheck())
    .then(success => appSetup())
    .then(success => session())
}
