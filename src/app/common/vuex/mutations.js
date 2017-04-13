import { isEmpty } from 'lodash'

export default {
  'global/TOKEN_RECEIVED' (state, token) {
    if (!isEmpty(token)) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
      localStorage.clear()
    }

    state.token = token
  },

  'global/USER_RECEIVED' (state, user) {
    state.user = user
  },
}
