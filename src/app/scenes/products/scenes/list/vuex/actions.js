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
      .then(response => {
        context.commit('products/list/RECEIVED', response.data)
        context.commit('global/tableList/LOADING_CHANGED', false)
      })
      .catch(error => {
        console.log(error);
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
