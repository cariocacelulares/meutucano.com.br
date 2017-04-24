import Orders from './components/Orders'
import { routes as list } from './scenes/list'

export default [
  {
    path: '/orders',
    name: 'orders',
    component: Orders,
    meta: {
      auth: true,
      breadcrumb: 'Pedidos'
    },
    children: [
      ...list,
    ],
  },
]
