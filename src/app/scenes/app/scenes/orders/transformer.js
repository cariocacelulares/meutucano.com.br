import { default as CommonTransformer } from 'common/transformer'

const STATUS_COLORS = {
  0: 'dark',
  1: 'primary',
  2: 'danger',
  3: 'success',
}

export default {
  transform: (order) => {
    const status = order.status;

    order.status = {
      code: status,
      description: order.status_description,
      color: STATUS_COLORS[status],
    }

    order.marketplace = order.marketplace_readable

    order.created_at = CommonTransformer.date(order.created_at)
    order.total = CommonTransformer.monetary(order.total)

    return order
  }
}
