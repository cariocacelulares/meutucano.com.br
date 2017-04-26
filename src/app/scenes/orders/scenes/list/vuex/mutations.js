import { default as OrderTransformer } from '../../../transformer'

export default {
  'orders/list/RECEIVED' (state, orders) {
    orders = orders.map((order) =>
      OrderTransformer.transform(order)
    )

    state.orders = orders
  },
}
