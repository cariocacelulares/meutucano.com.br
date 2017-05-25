export default {
  'depots/list/FETCH' (context, params) {
    return axios.get('depots' + params)
  },

  'depots/list/CHANGE_FILTER' (context, filter) {
    context.commit('depots/list/FILTER_CHANGED', filter)
    context.dispatch('global/tableList/FETCH')
  },
}
