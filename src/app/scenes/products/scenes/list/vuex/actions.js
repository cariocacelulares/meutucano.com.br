import { isEmpty } from 'lodash'
import { default as Products } from '../services/products'

export default {
  'products/list/FETCH' (context) {
    context.commit('global/tableList/LOADING_CHANGED', true)

    return Products.getList(parseParams(context.getters['global/tableList/GET_PARAMS']))
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
}
