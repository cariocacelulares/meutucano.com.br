export default {
  'users/list/FETCH' (context, params) {
    return axios.get('users' + params)
  },

  'users/list/CHANGE_FILTER' (context, filter) {
    context.commit('users/list/FILTER_CHANGED', filter)
    context.dispatch('global/tableList/FETCH')
  },
}
