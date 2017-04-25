import { isEmpty } from 'lodash'
import { default as Products } from '../services/products'

export default {
  'products/list/FETCH' (context) {
    context.commit('global/tableList/LOADING_CHANGED', true)

    const params = {
      page: context.getters['global/tableList/GET_PAGE'].current,
      perPage: context.getters['global/tableList/GET_PERPAGE'].current,
    }

    return Products.getList(params)
      .then((response) => {
        const data = response.data.data;

        context.commit('products/list/RECEIVED', data.data)

        context.commit('global/tableList/LOADING_CHANGED', false)

        context.commit('global/tableList/PERPAGE_CHANGED', data.per_page)
        context.commit('global/tableList/ROWS_CHANGED', data.total)
        context.commit('global/tableList/PAGE_CHANGED', {
          current: data.current_page,
          total: data.last_page,
        })
      })
  },

  'products/list/SEARCH' (context, term) {
    if (isEmpty(term)) {
      context.dispatch('products/list/FETCH')
    } else {
      context.commit('global/tableList/LOADING_CHANGED', true)

      return Products.search(term)
      .then(response => {
        context.commit('products/list/RECEIVED', response.data)
        context.commit('global/tableList/LOADING_CHANGED', false)
      })
      .catch(error => {
        console.log(error);
      })
    }
  },
}
