import Connection from '../util/Connection'

export default {
  getNetworkState () {
    return navigator.connection.type
  },
  getConnectionDescription () {
    let states = {}
    states[Connection.UNKNOWN] = 'Unknown connection'
    states[Connection.ETHERNET] = 'Ethernet connection'
    states[Connection.WIFI] = 'WiFi connection'
    states[Connection.CELL_2G] = 'Cell 2G connection'
    states[Connection.CELL_3G] = 'Cell 3G connection'
    states[Connection.CELL_4G] = 'Cell 4G connection'
    states[Connection.CELL] = 'Cell generic connection'
    states[Connection.NONE] = 'No network connection'
    return states[this.getNetworkState()]
  },
  getConnectionIcon () {
    let icons = {}
    icons[Connection.UNKNOWN] = 'help_outline'
    icons[Connection.ETHERNET] = 'wifi'
    icons[Connection.WIFI] = 'wifi'
    icons[Connection.CELL_2G] = 'signal_cellular_alt'
    icons[Connection.CELL_3G] = 'signal_cellular_alt'
    icons[Connection.CELL_4G] = 'signal_cellular_alt'
    icons[Connection.CELL] = 'signal_cellular_alt'
    icons[Connection.NONE] = 'signal_cellular_off'
    return icons[this.getNetworkState()]
  },
  isOnline () {
    let networkState = this.getNetworkState()
    return networkState !== Connection.NONE
  }
}
