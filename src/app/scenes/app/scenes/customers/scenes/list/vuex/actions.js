export default {
  'customers/list/FETCH' (context, params) {
    return axios.get('customers' + params)
  },

  'customers/list/CHANGE_FILTER' (context, filter) {
    context.commit('customers/list/FILTER_CHANGED', filter)
    context.dispatch('global/tableList/FETCH')
  },
}
