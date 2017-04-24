import { isEmpty } from 'lodash'
import { default as Orders } from '../services/orders'

export default {
  'orders/list/FETCH' (context) {
    context.commit('global/tableList/LOADING_CHANGED', true)

    const params = {
      page: context.getters['global/tableList/GET_PAGE'].current,
      perPage: context.getters['global/tableList/GET_PERPAGE'].current,
    }

    return Orders.getList(params)
      .then(response => {
        context.commit('orders/list/RECEIVED', response.data)
        context.commit('global/tableList/LOADING_CHANGED', false)
      })
      .catch(error => {
        console.log(error);
      })
  },

  'orders/list/SEARCH' (context, term) {
    if (isEmpty(term)) {
      context.dispatch('orders/list/FETCH')
    } else {
      context.commit('global/tableList/LOADING_CHANGED', true)

      return Orders.search(term)
      .then(response => {
        context.commit('orders/list/RECEIVED', response.data)
        context.commit('global/tableList/LOADING_CHANGED', false)
      })
      .catch(error => {
        console.log(error);
      })
    }
  },
}
