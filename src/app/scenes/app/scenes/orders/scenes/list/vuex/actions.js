export default {
  'orders/list/FETCH' (context, params) {
    return axios.get('pedidos/list' + params)
  },
}
