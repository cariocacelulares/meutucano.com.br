export default {
  token: localStorage.getItem('auth_token') || null,
  user: null,
  toasts: [],
  namespace: '',
}
