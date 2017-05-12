export default {
  'global/tableList/FETCH' (context) {
    const namespace = context.getters['global/GET_NAMESPACE']

    context.commit('global/tableList/LOADING_CHANGED', true)

    return context.dispatch(
      `${namespace}/FETCH`,
      parseParams(context.getters['global/tableList/GET_PARAMS'])
    )
      .then(
        (response) => {
          const data = response.data;

          context.commit(`${namespace}/RECEIVED`, data.data)

          context.commit('global/tableList/LOADING_CHANGED', false)

          context.commit('global/tableList/PERPAGE_CHANGED', data.per_page)
          context.commit('global/tableList/ROWS_CHANGED', data.total)
          context.commit('global/tableList/PAGE_CHANGED', {
            current: data.current_page,
            total: data.last_page,
          })
        },
        (error) => {
          context.commit('global/tableList/LOADING_CHANGED', false)

          context.dispatch('global/ADD_TOAST', {
            title: 'Não foi carregar os dados!',
            message: 'Ocorreu um erro! Contate um adminstrador.',
            type: 'error'
          })
        }
      )
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
    context.dispatch('global/tableList/FETCH')
  },

  'global/tableList/PREV_PAGE' (context) {
    context.commit('global/tableList/PAGE_CHANGED', (context.getters['global/tableList/GET_PAGE'].current - 1))
    context.dispatch('global/tableList/FETCH')
  },

  'global/tableList/NEXT_PAGE' (context) {
    context.commit('global/tableList/PAGE_CHANGED', (context.getters['global/tableList/GET_PAGE'].current + 1))
    context.dispatch('global/tableList/FETCH')
  },

  'global/tableList/LAST_PAGE' (context) {
    context.commit('global/tableList/PAGE_CHANGED', context.getters['global/tableList/GET_PAGE'].total)
    context.dispatch('global/tableList/FETCH')
  },

  'global/tableList/SEARCH' (context, term) {
    context.commit('global/tableList/SEARCH_CHANGED', term)
    context.dispatch('global/tableList/FETCH')
  },
}
