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

  'global/TOAST_ADDED' (state, attrs) {
    if (typeof(attrs.type) == 'undefined' || isEmpty(attrs.type)) {
      attrs.type = 'info'
    }

    state.toasts.push(attrs)
  },

  'global/NAMESPACE_CHANGED' (state, namespace) {
    state.namespace = namespace
  },
}
