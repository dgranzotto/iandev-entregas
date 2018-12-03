export default {
  isConfirmada (entrega) {
    return entrega.ocorrencia && entrega.ocorrencia.confirmaEntrega === 'Sim'
  },
  isRetorno (entrega) {
    return entrega.ocorrencia && entrega.ocorrencia.idCargaEntregaMotivoRetorno
  }
}
