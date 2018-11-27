import store from '../store'

export default {
  getEntregas () {
    const params = {
      usr: store.state.session.userSession.usr,
      pwd: store.state.session.userSession.pwdHash,
      cor: true,
      apelido: 'GESTAOENTREGA-server-side-entregas-app',
      action: 'execAndGetObject',
      scriptFunction: 'get-entregas'
    }
    return store.state.app.axios.get('bdoserver2.7/CntServlet', { params: params })
      .then(response => {
        if (response.headers['result'] === 'ok') {
          console.log(response)
          store.commit('app/setEntregas', response.data)
        } else {
          store.commit('app/setEntregasLastAttempt', 'error', 'Erro ao tentar sincronizar')
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  syncEntregas () {
    return store.dispatch('app/getEntregas')
  }
}
