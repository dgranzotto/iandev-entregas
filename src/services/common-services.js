import store from '../store'
import { _LocalStorage } from '../boot/local-storage'

export const setUserSession = (payload) => {
  store.commit('session/setUserSession', payload)
  _LocalStorage.set('userSession', payload)
  return Promise.resolve(payload)
}

export const setUser = (payload) => {
  store.commit('session/setUser', payload)
  _LocalStorage.set('user', payload)
  return Promise.resolve(payload)
}
