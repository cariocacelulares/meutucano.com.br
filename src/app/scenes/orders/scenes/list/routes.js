import OrderList from './components/OrderList'

export default [
    {
      path: '/orders/list',
      component: OrderList,
      name: 'orders.list',
      meta: {
        auth: true,
        breadcrumb: 'Lista'
      }
    },
]
