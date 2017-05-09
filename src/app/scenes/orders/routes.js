import Orders from './components/Orders'
import { routes as list } from './scenes/list'
import { routes as detail } from './scenes/detail'

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
      ...detail,
    ],
  },
]
