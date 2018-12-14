export const setUserSession = (state, payload) => {
  state.userSession = payload
  state.userSession.lastLogin = new Date()
  let idx = payload.url.indexOf('://')
  state.userSession.dbName = payload.usr + '@' + payload.url.substring(idx >= 0 ? idx + 3 : 0) + '.db'
  state.userSession.dbName = state.userSession.dbName.replace(':', '-')
}

export const setUserInfo = (state, payload) => {
  state.userInfo = payload
  state.userInfo.idsetup = 'userInfo'
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
  state.userInfo = {
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
