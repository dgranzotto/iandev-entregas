import config from '../../config'

export default {
  setup: {
    language: config.language.default
  },
  env: {
    online: false,
    networkState: null,
    networkIcon: 'signal_cellular_off',
    syncing: false
  },
  motivosRetorno: [],
  entregas: [],
  numEntregas: 0,
  entregasInfo: {
    idsetup: 'entregasInfo',
    entregasLastSync: null,
    entregasLastSyncAttempt: null,
    entregasLastSyncAttemptStatus: null,
    entregasLastSyncAttemptMessage: null
  },
  entregaAtual: {
    itemAtual: {
      midias: []
    },
    ocorrencia: {
      data: null,
      hora: null,
      latitudeConfirmacaoEntrega: null,
      longitudeConfirmacaoEntrega: null,
      distanciaConfirmacaoEntrega: null,
      idCargaEntregaMotivoRetorno: null,
      observacao: null,
      imagemReciboPath: null,
      confirmaEntrega: null
    }
  }
}
