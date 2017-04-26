import { isEmpty } from 'lodash'

export default {
  'global/tableList/GET_PAGE' ({ tableList }) {
    return tableList.page
  },

  'global/tableList/GET_ROWS' ({ tableList }) {
    return tableList.rows
  },

  'global/tableList/GET_LOADING' ({ tableList }) {
    return tableList.loading
  },

  'global/tableList/GET_SEARCHTERM' ({ namespace, tableList }) {
    let searchTerm = localStorage.getItem(`${namespace}/searchTerm`);

    if (!isEmpty(searchTerm)) {
      return searchTerm
    }

    return tableList.searchTerm
  },

  'global/tableList/GET_PERPAGE' ({ namespace, tableList }) {
    let perPage = localStorage.getItem(`${namespace}/perPage`);

    if (!isEmpty(perPage)) {
      return perPage
    }

    return tableList.perPage
  },

  'global/tableList/GET_PARAMS' ({ namespace, tableList }) {
    return {
      fields: localStorage.getItem(`${namespace}/searchTerm`) || tableList.searchTerm,
      page: tableList.page.current,
      per_page: tableList.perPage,
    }
  },
}
