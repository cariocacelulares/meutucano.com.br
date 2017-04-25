export default {
  authenticate (credentials) {
    return window.axios.post('/authenticate', credentials)
  }
}
