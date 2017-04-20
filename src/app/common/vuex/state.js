export default {
  token: localStorage.getItem('auth_token') || null,
  user: null,
  namespace: '',
  tableList: {
    rows: 0,
    perPage: 10,
    page: {
      current: 1,
      total: 1,
    },
    loading: false
  }
}
