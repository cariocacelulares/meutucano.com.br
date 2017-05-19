import { default as OrderTransformer } from '../../../transformer'

export default {
  'orders/detail/ORDER_RECEIVED' (state, order) {
    state.order = OrderTransformer.transform(order)
  },
}
