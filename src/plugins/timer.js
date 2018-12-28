import bo from '../bo/entrega-bo'
import entregaServices from '../services/entrega-services'
import store from '../store'
import network from '../util/network'
import uiUtil from '../ui-util'

// let sendTimer = null
// let receiveTimer = null
let networkCheckTimer = null

export default ({ Vue }) => {
  let config = store.state.session.userInfo.config
  if (config.networkcheckinterval > 0) {
    networkCheckTimer = setTimeout(networkCheck, config.networkcheckinterval)
    // console.log(`Network Check: ${config.networkcheckinterval} ms`)
  }
}

export const networkCheck = () => {
  let isOnline = network.getNetworkState()
  store.commit('app/setOnline', isOnline)
  if (isOnline && !store.state.app.env.syncing) {
    entregaServices.saveOcorrenciasStart((count) => {
      if (count > 0) {
        uiUtil.showSuccessMessage(bo.getDescEnvioOcorrenciasServer(count))
      }
    })
  }
  clearTimeout(networkCheckTimer)
  networkCheckTimer = setTimeout(networkCheck, store.state.session.userInfo.config.networkcheckinterval)
}
