import bo from '../../bo/entrega-bo'

export const getRealizadas = (state) => {
  let realizadas = []
  let len = state.entregas.length
  for (let i = 0; i < len; i++) {
    if (bo.isRealizada(state.entregas[i])) {
      realizadas.push(state.entregas[i])
    }
  }
  return realizadas
}

export const getNumRealizadas = (state, getters) => {
  return getters.getRealizadas.length
}

export const getRetornos = (state) => {
  let retornos = []
  let len = state.entregas.length
  for (let i = 0; i < len; i++) {
    if (bo.isRetorno(state.entregas[i])) {
      retornos.push(state.entregas[i])
    }
  }
  return retornos
}

export const getNumRetornos = (state, getters) => {
  return getters.getRetornos.length
}

export const getNaoPendentes = (state) => {
  let naoPendentes = []
  let len = state.entregas.length
  for (let i = 0; i < len; i++) {
    if (bo.isNaoPendente(state.entregas[i])) {
      naoPendentes.push(state.entregas[i])
    }
  }
  return naoPendentes
}

export const getNumNaoPendentes = (state, getters) => {
  return getters.getNaoPendentes.length
}

export const getPendentes = (state) => {
  let pendentes = []
  let len = state.entregas.length
  for (let i = 0; i < len; i++) {
    if (!bo.isPendente(state.entregas[i])) {
      pendentes.push(state.entregas[i])
    }
  }
  return pendentes
}

export const getNumPendentes = (state, getters) => {
  return getters.getPendentes.length
}

export const isRealizada = (state) => {
  return (entrega) => bo.isRealizada(entrega)
}

export const isRetorno = (state) => {
  return (entrega) => bo.isRetorno(entrega)
}

export const isNaoPendente = (state) => {
  return (entrega) => bo.isNaoPendente(entrega)
}

export const isPendente = (state) => {
  return (entrega) => bo.isPendente(entrega)
}
