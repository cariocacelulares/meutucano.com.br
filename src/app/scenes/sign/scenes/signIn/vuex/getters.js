import * as types from './types'

export default {
  [types.GET_USER] ({ user }) {
    return user
  },

  [types.IS_AUTH] ({ token }) {
    return !!token
  }
}
