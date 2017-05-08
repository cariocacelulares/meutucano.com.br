export default {
  'global/GET_USER' ({ user }) {
    return user || JSON.parse(localStorage.getItem('auth_user')) || null
  },

  'global/GET_TOKEN' ({ token }) {
    return token || localStorage.getItem('auth_token') || null
  },

  'global/IS_AUTH' ({ token }) {
    return !!token
  },

  'global/GET_TOASTS' ({ toasts }) {
    return toasts
  },

  'global/GET_NAMESPACE' ({ namespace }) {
    return namespace
  },
}
