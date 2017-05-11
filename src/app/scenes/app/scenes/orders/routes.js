import Orders from './components/Orders'
import { routes as list } from './scenes/list'
import { routes as detail } from './scenes/detail'
import { routes as form } from './scenes/form'

export default [
  {
    path: '/orders',
    name: 'orders',
    component: Orders,
    meta: {
      auth: true,
      breadcrumb: 'Pedidos'
    },
    redirect: '/orders/list',
    children: [
      ...list,
      ...detail,
      ...form,
    ],
  },
]
