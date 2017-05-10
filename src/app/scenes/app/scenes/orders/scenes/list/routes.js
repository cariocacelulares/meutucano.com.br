import List from './components/List'

export default [
    {
      path: '/orders/list',
      component: List,
      name: 'orders.list',
      meta: {
        auth: true,
        breadcrumb: 'Lista'
      }
    },
]
