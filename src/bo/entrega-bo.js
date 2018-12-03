export default {
  isRealizada (entrega) {
    return entrega.ocorrencia && entrega.ocorrencia.confirmaEntrega === 'Sim'
  },
  isRetorno (entrega) {
    return entrega.ocorrencia && entrega.ocorrencia.idCargaEntregaMotivoRetorno
  },
  isNaoPendente (entrega) {
    return this.isRealizada(entrega) || this.isRetorno(entrega)
  },
  isPendente (entrega) {
    return !this.isRealizada(entrega) && !this.isRetorno(entrega)
  }
}
