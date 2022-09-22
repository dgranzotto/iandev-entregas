export const setUserSession = (state, payload) => {
  console.log('userSession antigo ' + JSON.stringify(state.userSession))
  let newLogin = true
  if (state.userSession.usr === payload.usr) {
    newLogin = false
  }
  state.userSession = payload
  state.userSession.lastLogin = new Date()
  let idx = payload.url.indexOf('://')
  state.userSession.dbName = payload.usr + '@' + payload.url.substring(idx >= 0 ? idx + 3 : 0) + '.db'
  state.userSession.dbName = state.userSession.dbName.replace(':', '-')
  state.userSession.newLogin = newLogin
  console.log('userSession novo ' + JSON.stringify(payload))
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

export const setStatusButton = (state, statusButton) => {
  state.userPrefs.statusButton = statusButton
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
