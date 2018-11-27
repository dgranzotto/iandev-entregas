import config from '../../config'

export default {
  setup: {
    language: config.language.default
  },
  motivosretorno: [],
  entregas: [],
  entregasLastSync: null,
  entregasLastSyncAttempt: null,
  entregasLastSyncAttemptStatus: null,
  entregasLastSyncAttemptMessage: null,
  entregaAtual: null
}
