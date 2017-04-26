import { isEmpty } from 'lodash'
import { default as Products } from '../services/products'

export default {
  'products/list/FETCH' (context, params) {
    return Products.getList(params)
  },
}
