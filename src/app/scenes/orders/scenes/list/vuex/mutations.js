import { default as OrderTransformer } from '../../../services/transformer'

export default {
  'orders/list/RECEIVED' (state, orders) {
    orders = orders.map((order) =>
      OrderTransformer.transform(order)
    )

    state.orders = orders
  },
}
