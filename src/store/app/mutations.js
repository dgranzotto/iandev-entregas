import db from '../../db/db'
import { Quasar, LocalStorage } from 'quasar'
import { i18n } from '../../plugins/i18n'

export const setEntregas = (state, payload) => {
  state.motivosRetorno = payload.motivosretorno
  state.entregas = payload.entregas
  state.entregasLastSync = new Date()
  state.entregasLastSyncAttempt = state.entregasLastSync
  state.entregasLastSyncAttemptStatus = 'ok'
  state.entregasLastSyncAttemptMessage = 'Sincronização realizada com sucesso'
}

export const setEntregasLastAttempt = (state, status, message) => {
  state.entregasLastSyncAttempt = new Date()
  state.entregasLastSyncAttemptStatus = status
  state.entregasLastSyncAttemptMessage = message
}

export const setEntregaAtual = (state, payload) => {
  payload.itemAtual = { midias: [] }
  if (!payload.ocorrencia) {
    payload.ocorrencia = {}
    for (var obj in state.entregaAtual.ocorrencia) {
      payload.ocorrencia[obj] = null
    }
  }
  state.entregaAtual = payload
}

export const setItemAtual = (state, payload) => {
  payload.midias = payload.midias || []
  state.entregaAtual.itemAtual = payload
}

export const persistEntregas = (state) => {
  console.log('Persisting Entregas...')
  db.transaction((tx) => {
    db.saveEntregas(state.entregas, tx)
    console.log('Entregas persisted')
  }, (error) => {
    console.log(error)
  }, () => {
    console.log('Transaction End')
  })
}

export const loadEntregas = (state) => {
  console.log('Loading Entregas...')
  db.transaction((tx) => {
    db.getEntregas(tx, (entregas) => {
      state.entregas = entregas
      console.log(`${entregas.length} rows loaded`)
    }, (error) => {
      console.log(error)
    })
  }, (error) => {
    console.log(error)
  }, () => {
    console.log('Transaction End')
  })
}

export const persistMotivosRetorno = (state) => {
  console.log('Persisting Motivos de Retorno...')
  db.transaction((tx) => {
    db.saveMotivosRetorno(state.motivosRetorno, tx)
    console.log('Motivos de Retorno persisted')
  }, (error) => {
    console.log(error)
  }, () => {
    console.log('Transaction End')
  })
}

export const loadMotivosRetorno = (state) => {
  console.log('Loading Motivos de Retorno...')
  db.transaction((tx) => {
    db.getMotivosRetorno(tx, (motivosRetorno) => {
      state.motivosRetorno = motivosRetorno
      console.log(`${motivosRetorno.length} rows loaded`)
    }, (error) => {
      console.log(error)
    })
  }, (error) => {
    console.log(error)
  }, () => {
    console.log('Transaction End')
  })
}

export const setLanguage = (state, payload) => {
  let setup = LocalStorage.get('setup')
  setup.language = payload
  state.setup.language = payload
  LocalStorage.set('setup', setup)
  import(`quasar-framework/i18n/${payload}`).then(lang => {
    Quasar.i18n.set(lang.default)
  })
  i18n.locale = payload
}

export const setup = (state, payload) => {
  state.setup = payload
}
