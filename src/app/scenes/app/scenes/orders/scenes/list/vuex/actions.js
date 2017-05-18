export default {
  'orders/list/FETCH' (context, params) {
    return axios.get('orders' + params)
  },

  'orders/list/CHANGE_FILTER' (context, filter) {
    context.commit('orders/list/FILTER_CHANGED', filter)
    context.dispatch('global/tableList/FETCH')
  },
}
