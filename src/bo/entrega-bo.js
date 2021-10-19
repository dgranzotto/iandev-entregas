import file from '../util/file'
import moment from 'moment-timezone'

// const ENTREGAS_OUT_OF_DATE = 1000 * 60 * 60 * 24 * 2 // 2 dias
const ENTREGAS_OUT_OF_DATE = 1000 * 60 * 60 * 24 * 1 // 1 dia
// const ENTREGAS_OUT_OF_DATE = 1000 * 60 // 1 minuto

export default {
  isSync (entrega) {
    return entrega.sync && entrega.sync === 'true'
  },
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
  },
  isEntregasOutOfDate (entregasInfo) {
    return !(entregasInfo && entregasInfo.entregasLastSync && new Date().getTime() - entregasInfo.entregasLastSync.getTime() < ENTREGAS_OUT_OF_DATE)
  },
  getTimeOutOfDate (entregasInfo) {
    if (entregasInfo && entregasInfo.entregasLastSync) {
      let duration = moment.duration(moment(new Date()).diff(moment(entregasInfo.entregasLastSync)))
      return duration.as('hours')
    }
    return 'Não há entregas gravadas no dispositivo'
  },
  isToday (date) {
    return moment(date).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD')
  },
  getDateDescription (entregasInfo) {
    if (entregasInfo && entregasInfo.entregasLastSync) {
      let description = 'Last Sync: ' + moment(entregasInfo.entregasLastSync).format('DD/MM/YYYY HH:mm:ss') + '\n'
      description += 'Now: ' + moment(new Date()).format('DD/MM/YYYY HH:mm:ss') + '\n'
      description += this.getTimeOutOfDate(entregasInfo)
      return description
    }
    return 'Não há entregas gravadas no dispositivo'
  },
  getRealizadas (entregas) {
    let realizadas = []
    let len = 0
    if (entregas) {
      len = entregas.length
    }
    for (let i = 0; i < len; i++) {
      if (this.isRealizada(entregas[i])) {
        realizadas.push(entregas[i])
      }
    }
    return realizadas
  },
  getRetornos (entregas) {
    let retornos = []
    let len = 0
    if (entregas) {
      len = entregas.length
    }
    for (let i = 0; i < len; i++) {
      if (this.isRetorno(entregas[i])) {
        retornos.push(entregas[i])
      }
    }
    return retornos
  },
  getNaoPendentes (entregas) {
    let naoPendentes = []
    let len = 0
    if (entregas) {
      len = entregas.length
    }
    for (let i = 0; i < len; i++) {
      if (this.isNaoPendente(entregas[i])) {
        naoPendentes.push(entregas[i])
      }
    }
    return naoPendentes
  },
  getPendentes (entregas) {
    let pendentes = []
    let len = 0
    if (entregas) {
      len = entregas.length
    }
    for (let i = 0; i < len; i++) {
      if (this.isPendente(entregas[i])) {
        pendentes.push(entregas[i])
      }
    }
    return pendentes
  },
  getArrayOfMidias (entrega) {
    let idEntregaAndIdOcorrencia = this.getIdEntregaAndIdOcorrencia(entrega)
    let midias = []
    if (entrega.ocorrencia.imagemReciboPath) {
      midias.push(Object.assign({ tipoMidia: 'rec', filePath: entrega.ocorrencia.imagemReciboPath, midia: '', extMidia: file.getFilenameExtension(entrega.ocorrencia.imagemReciboPath), descricao: null, idProduto: null }, idEntregaAndIdOcorrencia))
    }
    let i, j
    let item, midia
    for (i = 0; i < entrega.itens.length; i++) {
      item = entrega.itens[i]
      if (item.midias) {
        for (j = 0; j < item.midias.length; j++) {
          midia = item.midias[j]
          midias.push(Object.assign({ tipoMidia: 'pro', filePath: midia.filePath, extMidia: file.getFilenameExtension(midia.filePath), descricao: midia.descricao, idProduto: item.idproduto }, idEntregaAndIdOcorrencia))
        }
      }
    }
    return midias
  },
  getIdEntrega (entrega) {
    return { idcargaentrega: entrega.idcargaentrega, idsaidaorigem: entrega.idsaidaorigem }
  },
  getIdEntregaAndIdOcorrencia (entrega) {
    return Object.assign(this.getIdEntrega(entrega), { idcargaentregaocorrencia: entrega.ocorrencia.idcargaentregaocorrencia })
  },
  getDescOcorrencia (entrega) {
    return 'Ocorrência de ' + (entrega.ocorrencia.idCargaEntregaMotivoRetorno ? 'Retorno' : 'Confirmação de Entrega') + ' para ' + entrega.descricao
  },
  getDescEnvioOcorrenciasServer (count) {
    if (count < 0) {
      return 'Erro ao enviar ocorrências ao servidor'
    } else if (count === 0) {
      return 'Nenhuma ocorrência foi enviada ao servidor'
    } else if (count === 1) {
      return '1 ocorrência foi enviada ao servidor'
    }
    return count + ' ocorrências foram enviadas ao servidor'
  }
}
