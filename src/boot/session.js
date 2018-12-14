import { _LocalStorage } from '../boot/local-storage'
import store from '../store'

export default () => {
  let userSession = Object.assign(store.state.session.userSession, _LocalStorage.get('userSession'))
  store.commit('session/setUserSession', userSession)
  return Promise.resolve(true)
}
