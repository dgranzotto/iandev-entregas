import bo from '../../bo/entrega-bo'

export const getRealizadas = (state) => {
  return () => {
    return bo.getRealizadas(state.entregas)
  }
}

export const getRealizadasAsProp = (state) => {
  return bo.getRealizadas(state.entregas)
}

export const getNumRealizadas = (state, getters) => {
  return () => {
    return getters.getRealizadas().length
  }
}

export const getRetornos = (state) => {
  return () => {
    return bo.getRetornos(state.entregas)
  }
}

export const getRetornosAsProp = (state) => {
  return bo.getRetornos(state.entregas)
}

export const getNumRetornos = (state, getters) => {
  return () => {
    return getters.getRetornos().length
  }
}

export const getNaoPendentes = (state) => {
  return () => {
    return bo.getNaoPendentes(state.entregas)
  }
}

export const getNaoPendentesAsProp = (state) => {
  return bo.getNaoPendentes(state.entregas)
}

export const getNumNaoPendentes = (state, getters) => {
  return () => {
    return getters.getNaoPendentes().length
  }
}

export const getPendentes = (state) => {
  return () => {
    return bo.getPendentes(state.entregas)
  }
}

export const getPendentesAsProp = (state) => {
  return bo.getPendentes(state.entregas)
}

export const getNumPendentes = (state, getters) => {
  return () => {
    return getters.getPendentes().length
  }
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

export const isEntregasOutOfDate = (state) => {
  return () => bo.isEntregasOutOfDate(state.entregasInfo)
}
