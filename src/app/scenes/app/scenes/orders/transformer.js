import { default as CommonTransformer } from 'common/transformer'

const STATUS_COLORS = {
  0: 'dark',
  1: 'primary',
  2: 'warning',
  4: 'info',
  3: 'success',
  5: 'danger',
  6: 'darker',
}

export default {
  transform: (order) => {
    const status = order.status;

    order.status = {
      code: status,
      description: order.status_cast,
      color: STATUS_COLORS[status],
    }

    // order.marketplace = order.marketplace_readable

    // order.created_at = CommonTransformer.date(order.created_at)
    // order.total = CommonTransformer.monetary(order.total)
    return order
  }
}
