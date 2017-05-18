export default {
  'products/list/FETCH' (context, params) {
    return axios.get('products' + params)
  },

  'products/list/CHANGE_FILTER' (context, filter) {
    context.commit('products/list/FILTER_CHANGED', filter)
    context.dispatch('global/tableList/FETCH')
  },
}
