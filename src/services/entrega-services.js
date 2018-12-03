// import db from '../db/db'
import store from '../store'

export default {
  getEntregas () {
    return store.state.app.axios.get('bdoserver2.7/CntServlet', { params: this.getParams('get-entregas') })
      .then(response => {
        if (response.headers['result'] === 'ok') {
          console.log(response)
          store.commit('app/setEntregas', response.data)
          store.commit('app/persistEntregas')
          store.commit('app/persistMotivosRetorno')
          // db.dumpDB()
          // store.commit('app/loadEntregas')
          // store.commit('app/loadMotivosRetorno')
        } else {
          store.commit('app/setEntregasLastAttempt', 'error', 'Erro ao tentar sincronizar')
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  saveOcorrencias (entregas) {
    let naoPendentes = store.app.getNaoPendentes()
    console.log(naoPendentes)
    return store.state.app.axios.post('bdoserver2.7/CntServlet', { params: this.getParams('save-ocorrencias') })
      .then(response => {
        if (response.headers['result'] === 'ok') {
          console.log(response)
        } else {
          // store.commit('app/setEntregasLastAttempt', 'error', 'Erro ao tentar sincronizar')
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  syncEntregas () {
    return store.dispatch('app/getEntregas')
  },
  getParams (scriptFunction) {
    return {
      usr: store.state.session.userSession.usr,
      pwd: store.state.session.userSession.pwdHash,
      cor: true,
      apelido: 'GESTAOENTREGA-server-side-entregas-app',
      action: 'execAndGetObject',
      scriptFunction: scriptFunction
    }
  }
}
