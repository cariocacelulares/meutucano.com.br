import { isEmpty } from 'lodash'

export default {
  'global/GET_USER' ({ user }) {
    return user
  },

  'global/GET_TOKEN' ({ user }) {
    return user
  },

  'global/IS_AUTH' ({ token }) {
    return !!token
  },

  'global/GET_NAMESPACE' ({ namespace }) {
    return namespace
  },

  'global/tableList/GET_PAGE' ({ tableList }) {
    return tableList.page
  },

  'global/tableList/GET_ROWS' ({ tableList }) {
    return tableList.rows
  },

  'global/tableList/GET_LOADING' ({ tableList }) {
    return tableList.loading
  },

  'global/tableList/GET_PERPAGE' ({ namespace, tableList }) {
    let perPage = localStorage.getItem(`${namespace}/perPage`);

    if (!isEmpty(perPage)) {
      return perPage
    }

    return tableList.perPage
  },
}
