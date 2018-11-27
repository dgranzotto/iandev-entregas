export const setUserSession = (state, payload) => {
  state.userSession = payload
  state.userSession.lastLogin = new Date()
}

export const setUser = (state, payload) => {
  state.user = payload
}

export const setUserPrefs = (state, payload) => {
  state.userPrefs = payload
}

export const setUserPrefsTimezone = (state, payload) => {
  state.userPrefs.timezone = payload
}

export const clear = (state) => {
  state.userSession = {
    usr: null,
    pwd: null,
    url: ''
  }
  state.user = {
    idusuario: null,
    usuario: '',
    idcolaborador: 0,
    colaborador: '',
    funcoes: [],
    bdousuario: {
      idusuario: 0,
      usuario: '',
      nomeusuario: ''
    }
  }
  state.userPrefs = {
    timezone: ''
  }
}
