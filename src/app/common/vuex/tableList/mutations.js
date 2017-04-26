import { isEmpty } from 'lodash'

export default {
  'global/tableList/PERPAGE_CHANGED' (state, amount) {
    state.tableList.perPage = amount
    localStorage.setItem(`${state.namespace}/perPage`, state.tableList.perPage)
  },

  'global/tableList/ROWS_CHANGED' (state, rows) {
    state.tableList.rows = rows
    // state.tableList.page.total = Math.ceil(state.tableList.rows / state.tableList.perPage)
  },

  'global/tableList/PAGE_CHANGED' (state, page) {
    if (typeof(page) == 'number') {
      state.tableList.page.current = page
      state.tableList.page.total = Math.ceil(state.tableList.rows / state.tableList.perPage)
    }

    if (typeof(page.current) != 'undefined' && page.current) {
      state.tableList.page.current = page.current
    }

    if (typeof(page.total) != 'undefined' && page.total) {
      state.tableList.page.total = page.total
    }
  },

  'global/tableList/LOADING_CHANGED' (state, loading) {
    state.tableList.loading = loading
  },

  'global/tableList/SEARCH_CHANGED' (state, term) {
    if (isEmpty(state.namespace)) {
      state.tableList.searchTerm = term
    } else {
      if (!isEmpty(term)) {
        localStorage.setItem(`${state.namespace}/searchTerm`, term)
      } else {
        localStorage.setItem(`${state.namespace}/searchTerm`, '')
      }
    }
  },
}
