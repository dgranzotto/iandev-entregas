// import something here
import store from '../store'
import uiUtil from '../ui-util'

// leave the export, even if you don't use it
export default ({ Vue }) => {
  document.addEventListener('offline', onOffline, false)
  document.addEventListener('online', onOnline, false)
  // uiUtil.showInfoMessage('offline, online events')
  let networkState = navigator.connection.type
  console.log(networkState)
}

export const onOffline = () => {
  store.commit('app/setOnline', false)
  uiUtil.showInfoMessage('offline')
}

export const onOnline = () => {
  store.commit('app/setOnline', true)
  uiUtil.showInfoMessage('online')
}
