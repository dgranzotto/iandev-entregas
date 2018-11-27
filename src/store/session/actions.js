import services from '../../services/session-services'
// import { _getUserNotifications } from '../../session/user-notifications'
// import { _updateTimezone } from '../../session/update-timezone'

export const login = (state, loginInfo) => {
  return services.login(loginInfo)
}

export const updateTimezone = (state, initialInfo) => {
  // return _updateTimezone(initialInfo)
}

export const getUserNotifications = (state) => {
  // return _getUserNotifications()
}
