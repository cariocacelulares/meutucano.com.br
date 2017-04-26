export default {
  getList (params) {
    return axios.get('pedidos/list' + params)
  }
}
