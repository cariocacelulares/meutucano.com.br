export default {
  'orders/list/RECEIVED' (state, orders) {
    orders = orders.map((order) => {
      let date = new Date(order.data)
      if (date != 'Invalid Date') {
        order.data = new Date(order.data).toLocaleString('pt-BR')
      }

      if (typeof(order.status.color === 'undefined')) {
        const colors = {
          1: 'primary',
          2: 'danger',
          3: 'success',
        }

        order.status.color = colors[order.status.code]
      }

      if (typeof(order.valor) == 'number') {
        order.valor = monetary.format(order.valor)
      }

      return order
    })

    state.orders = orders
  },
}
