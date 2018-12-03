import bo from '../bo/entrega-bo'

export const getRealizadas = (state) => {
    let realizadas = []
    let len = state.app.entregas.length
    for (let i = 0; i < len; i++) {
      if (bo.isRealizada(state.app.entregas[i])) {
        realizadas.push(state.app.entregas[i])
      }
    }
    return realizadas
}

export const getRetornos = (state) => {
    let retornos = []
    let len = state.app.entregas.length
    for (let i = 0; i < len; i++) {
      if (bo.isRetorno(state.app.entregas[i])) {
        retornos.push(state.app.entregas[i])
      }
    }
    return retornos
}

export const getNaoPendentes = (state) => {
    let naoPendentes = []
    let len = state.app.entregas.length
    for (let i = 0; i < len; i++) {
      if (bo.isRealizada(state.app.entregas[i]) || bo.isConfirmada(state.app.entregas[i])) {
        naoPendentes.push(state.app.entregas[i])
      }
    }
    return naoPendentes
}

export const getPendentes = (state) => {
    let pendentes = []
    let len = state.app.entregas.length
    for (let i = 0; i < len; i++) {
      if (!bo.isRealizada(state.app.entregas[i]) && !bo.isConfirmada(state.app.entregas[i])) {
        pendentes.push(state.app.entregas[i])
      }
    }
    return pendentes
}
