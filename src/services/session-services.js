import axios from 'axios'
import store from '../store'
import utilHash from '../util/hash.js'
import { setUserSession, setUser } from './common-services'

export default {
  login (payload) {
    payload.pwdHash = '!' + utilHash.getHashSHA1(payload.pwd)
    const params = {
      usr: payload.usr,
      pwd: payload.pwdHash,
      cor: true,
      apelido: 'GESTAOENTREGA-server-side-entregas-app',
      action: 'execAndGetObject',
      scriptFunction: 'auth'
    }
    const baseURL = ((payload.url.indexOf('://') === -1) ? 'http://' : '') + payload.url
    axios.defaults.baseURL = baseURL
    store.state.app.axios = axios
    return axios.get('bdoserver2.7/CntServlet', { params: params })
      .then(response => {
        if (response.headers['result'] === 'ok') {
          console.log(response)
          setUserSession(payload)
          setUser(response.data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
}
