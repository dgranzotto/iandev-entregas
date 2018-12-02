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
