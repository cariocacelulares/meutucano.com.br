import { isEmpty } from 'lodash'
import * as types from './types'

export default {
  [types.TOKEN_RECEIVED] (state, token) {
    if (!isEmpty(token)) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }

    state.token = token
  },

  [types.USER_RECEIVED] (state, user) {
    state.user = user
  }
}
