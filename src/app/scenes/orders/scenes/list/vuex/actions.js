import { isEmpty } from 'lodash'
import { default as Orders } from '../services/orders'

export default {
  'orders/list/FETCH' (context, params) {
    return Orders.getList(params)
  },
}
