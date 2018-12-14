import axios from 'axios'
import store from '../store'
import utilHash from '../util/hash.js'
import { setUserSession, setUserInfo } from './common-services'

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
    // axios.defaults.headers.post['crossDomain'] = true
    store.state.app.axios = axios
    return axios.get('bdoserver2.7/CntServlet', { params: params })
      .then(response => {
        if (response.headers['result'] === 'ok') {
          console.log(response)
          setUserSession(payload)
          setUserInfo(response.data)
          return Promise.resolve(response)
        }
        return Promise.reject(new Error(response.headers['result']))
      })
      .catch(error => {
        console.log(error)
        return Promise.reject(error)
      })
  }
}
