import { User } from '../services'

export default {
  'global/SIGN_OUT' (context) {
    context.commit('global/TOKEN_RECEIVED', null);
    context.commit('global/USER_RECEIVED', null);
  },

  'global/FETCH_USER' (context, token) {
    return User.get()
      .then(response => {
        context.commit('global/USER_RECEIVED', response.data.user);
      })
      .catch(error => {
        console.log(error);
      })
  },

  'global/REFRESH_TOKEN' (context) {
    return axios.get('token')
      .then(
        (response) => {
          context.commit('global/TOKEN_RECEIVED', response.data.token)
          context.dispatch('global/FETCH_USER', response.data.token)
        }
      )
  },

  'global/ADD_TOAST' (context, attrs) {
    context.commit('global/TOAST_ADDED', attrs)
  },

  'global/SET_NAMESPACE' (context, namespace) {
    context.commit('global/NAMESPACE_CHANGED', namespace)
  },

  'global/tableList/CHANGE_PERPAGE' (context, amount) {
    context.commit('global/tableList/PERPAGE_CHANGED', amount)
    context.dispatch('global/tableList/FIRST_PAGE')
  },

  'global/tableList/CHANGE_ROWS' (context, rows) {
    context.commit('global/tableList/ROWS_CHANGED', rows)
  },

  'global/tableList/FIRST_PAGE' (context) {
    context.commit('global/tableList/PAGE_CHANGED', 1)
    context.dispatch(context.getters['global/GET_NAMESPACE'] + '/FETCH')
  },

  'global/tableList/PREV_PAGE' (context) {
    context.commit('global/tableList/PAGE_CHANGED', (context.getters['global/tableList/GET_PAGE'].current - 1))
    context.dispatch(context.getters['global/GET_NAMESPACE'] + '/FETCH')
  },

  'global/tableList/NEXT_PAGE' (context) {
    context.commit('global/tableList/PAGE_CHANGED', (context.getters['global/tableList/GET_PAGE'].current + 1))
    context.dispatch(context.getters['global/GET_NAMESPACE'] + '/FETCH')
  },

  'global/tableList/LAST_PAGE' (context) {
    context.commit('global/tableList/PAGE_CHANGED', context.getters['global/tableList/GET_PAGE'].total)
    context.dispatch(context.getters['global/GET_NAMESPACE'] + '/FETCH')
  },

  'global/tableList/SEARCH' (context, term) {
    context.commit('global/tableList/SEARCH_CHANGED', term)
    context.dispatch(context.getters['global/GET_NAMESPACE'] + '/FETCH')
  },
}
