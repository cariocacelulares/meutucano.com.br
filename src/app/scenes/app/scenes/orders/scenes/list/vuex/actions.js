export default {
  'orders/list/FETCH' (context, params) {
    return axios.get('orders' + params)
  },
}
