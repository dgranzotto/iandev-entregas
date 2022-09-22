import bo from '../bo/entrega-bo'
import dao from '../db/dao'
import file from '../util/file'
import store from '../store'
import db from '../db/db'

export default {
  getEntregas () {
    if (store.state.session.userPrefs.statusButton) {
      db.cleanTables()
      return store.state.app.axios.get('bdoserver2.7/CntServlet', { params: this.getParams('get-entregas') })
        .then(response => {
          if (response.headers['result'] === 'ok') {
            console.log(response)
            store.commit('app/setEntregas', response.data)
            dao.saveEntregas(store.state.app.entregas)
              .then(result => {
                console.log('Entregas gravadas com sucesso')
                dao.saveMotivosRetorno(store.state.app.motivosRetorno)
                  .then(result => {
                    console.log('Motivos de retorno gravados com sucesso')
                    dao.saveEntregasInfo(store.state.app.entregasInfo)
                      .then(result => {
                        console.log('Informações das entregas gravadas com sucesso')
                        return Promise.resolve(response)
                      })
                  })
              })
          } else {
            store.commit('app/setEntregasLastAttempt', 'error', 'Erro ao buscar entregas')
            return Promise.reject(new Error(response.headers['result']))
          }
        })
        .catch(error => {
          console.log(error)
          return Promise.reject(error)
        })
    }
  },
  saveOcorrenciasStart (success, error) {
    if (store.state.session.userPrefs.statusButton) {
      let naoPendentes = bo.getNaoPendentes(store.state.app.entregas)
      console.log('Não Pendentes:', naoPendentes)
      this.saveOcorrencias(naoPendentes, success, error)
    }
  },
  saveOcorrencias (entregas, success, error, idx, count) {
    if (entregas.length === 0) {
      success(0)
      return
    } if (idx >= entregas.length) {
      success(-1)
      return
    }
    idx = idx || 0
    count = count || 0
    if (!bo.isSync(entregas[idx])) { // não sincronizada
      console.log(`Sending ocorrencia (${idx})`, entregas[idx].ocorrencia)
      if (count === 0) {
        store.commit('app/setSyncing', true)
      }
      this.saveOcorrencia(entregas[idx], (entrega) => {
        dao.saveEntrega(entrega)
          .then(result => {
            console.log('Ocorrência gravada após sincronização')
          })
          .catch(error => {
            console.log('Erro ao gravar ocorrência após sincronização')
            console.log(error)
          })
          .finally(() => {
            count++
            if (idx + 1 < entregas.length) {
              this.saveOcorrencias(entregas, success, error, idx + 1, count) // vai para a próxima ocorrência
            } else {
              store.commit('app/setSyncing', false)
              success(count) // última ocorrência, finaliza o processo
            }
          })
      }, (err) => {
        store.commit('app/setSyncing', false)
        error && error(err)
      })
    } else { // já sincronizada
      if (idx + 1 < entregas.length) {
        this.saveOcorrencias(entregas, success, error, idx + 1, count) // vai para a próxima ocorrência
      } else {
        store.commit('app/setSyncing', false)
        success(count) // última ocorrência, finaliza o processo
      }
    }
  },
  saveOcorrencia (entrega, success, error) {
    if (store.state.session.userPrefs.statusButton) {
      let setSyncing = !store.state.app.env.syncing
      if (setSyncing) {
        store.commit('app/setSyncing', true)
      }
      let ocorrencia = Object.assign(entrega.ocorrencia, bo.getIdEntrega(entrega))
      console.log('Sending ocorrencia', ocorrencia)
      return store.state.app.axios.post('bdoserver2.7/CntServlet', 'ocorrencia=' + JSON.stringify(ocorrencia), { params: this.getParams('save-ocorrencia') })
        .then(response => {
          if (response.headers['result'] === 'ok') {
            // console.log(response)
            // console.log(entrega)
            entrega.ocorrencia.idcargaentregaocorrencia = response.data.entity.idcargaentregaocorrencia
            this.saveMidiasStart(entrega, (count) => {
              if (count >= 0) {
                entrega.sync = 'true'
                success && success(entrega)
              } else {
                console.log('Erro ao enviar midias')
                error && error('Erro ao enviar midias')
              }
            }, (err) => {
              console.log(err)
              error && error(err)
            })
          } else {
            console.log('Erro ao salvar ocorrência')
            error && error('Erro ao salvar ocorrência')
          }
        })
        .catch(err => {
          console.log(err)
          error && error(err)
        })
        .finally(() => {
          if (setSyncing) {
            store.commit('app/setSyncing', false)
          }
        })
    }
  },
  saveMidiasStart (entrega, success, error) {
    if (store.state.session.userPrefs.statusButton) {
      let midias = bo.getArrayOfMidias(entrega)
      console.log('Midias: ', midias)
      this.saveMidias(midias, success, error)
    }
  },
  saveMidias (midias, success, error, idx) {
    if (midias.length === 0) {
      success(0)
      return
    } if (idx >= midias.length) {
      success(-1)
      return
    }
    idx = idx || 0
    console.log(`Sending midia (${idx})`, midias[idx])
    this.saveMidia(midias[idx], (midia) => {
      if (idx + 1 < midias.length) {
        this.saveMidias(midias, success, error, idx + 1) // vai para a próxima midia
      } else {
        success(idx + 1) // última midia, finaliza o processo
      }
    }, (err) => {
      error && error(err)
    })
  },
  saveMidia (midia, success, error) {
    file.getFileContentAsBase64(midia.filePath, (base64) => {
      if (base64) {
        midia.midia = base64
        return store.state.app.axios.post('bdoserver2.7/CntServlet', 'midia=' + JSON.stringify(midia), { params: this.getParams('save-midia') })
          .then(response => {
            if (response.headers['result'] === 'ok') {
              // console.log(response)
              midia.idCargaEntregaOcorrencia = response.idcargaentregaocorrencia
              // console.log(midia)
              success && success(midia)
            } else {
              error && error(response.headers['result'])
            }
          })
          .catch(err => {
            console.log(err)
            error && error(err)
          })
      }
    })
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
