import Customers from './components/Customers'
import { routes as list } from './scenes/list'
import { routes as form } from './scenes/form'
// import { routes as detail } from './scenes/detail'

export default [
  {
    redirect: '/customers/list',
    path: '/customers',
    name: 'customers',
    component: Customers,
    meta: {
      auth: true,
      breadcrumb: 'Clientes'
    },
    children: [
      ...list,
      ...form,
      // ...detail,
    ],
  },
]
