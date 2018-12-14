import store from '../store'
import { _LocalStorage } from '../boot/local-storage'

export const setUserSession = (payload) => {
  store.commit('session/setUserSession', payload)
  _LocalStorage.set('userSession', payload)
  return Promise.resolve(payload)
}

export const setUserInfo = (payload) => {
  store.commit('session/setUserInfo', payload)
  // _LocalStorage.set('userInfo', payload)
  return Promise.resolve(payload)
}
