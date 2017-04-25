import { isEmpty } from 'lodash'

export default {
  'global/TOKEN_RECEIVED' (state, token) {
    if (!isEmpty(token)) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
      localStorage.clear()
    }

    state.token = token
  },

  'global/USER_RECEIVED' (state, user) {
    state.user = user
  },

  'global/TOAST_ADDED' (state, attrs) {
    if (typeof(attrs.type) == 'undefined' || isEmpty(attrs.type)) {
      attrs.type = 'info'
    }

    state.toasts.push(attrs)
  },

  'global/NAMESPACE_CHANGED' (state, namespace) {
    state.namespace = namespace
  },

  'global/tableList/PERPAGE_CHANGED' (state, amount) {
    console.log(amount);
    state.tableList.perPage = amount
    localStorage.setItem(`${state.namespace}/perPage`, state.tableList.perPage)
  },

  'global/tableList/ROWS_CHANGED' (state, rows) {
    state.tableList.rows = rows
    state.tableList.page.total = Math.ceil(state.tableList.rows / state.tableList.perPage)
  },

  'global/tableList/PAGE_CHANGED' (state, page) {
    if (typeof(page.current) != 'undefined' && page.current) {
      console.log(1);
      state.tableList.page.current = page.current
    }

    if (typeof(page.total) != 'undefined' && page.total) {
      console.log(2);
      state.tableList.page.total = page.total
    }

    state.tableList.page = {
      total: page.total,
      current: page.current
    }

      console.log(page, state.tableList.page);
  },

  'global/tableList/LOADING_CHANGED' (state, loading) {
    state.tableList.loading = loading
  },
}
