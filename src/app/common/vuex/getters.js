export default {
  'global/GET_USER' ({ user }) {
    return user
  },

  'global/GET_TOKEN' ({ user }) {
    return user
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
