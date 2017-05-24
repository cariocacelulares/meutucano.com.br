import { default as CommonTransformer } from 'common/transformer'

const STATUS_COLORS = {
  0: 'default',
  1: 'primary',
  2: 'warning',
  4: 'info',
  3: 'success',
  5: 'danger',
  6: 'darker',
}

export default {
  transform: (customer) => {
    if (typeof(customer.orders) != 'undefined' && customer.orders.length) {
      customer.orders.forEach((order) => {
        order.status_color = STATUS_COLORS[order.status]
      })
    }

    return customer
  }
}
