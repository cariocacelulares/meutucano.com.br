import Products from './components/Products'
import { routes as list } from './scenes/list'
import { routes as form } from './scenes/form'

export default [
  {
    redirect: '/products/list',
    path: '/products',
    name: 'products',
    component: Products,
    meta: {
      auth: true,
      breadcrumb: 'Produtos'
    },
    children: [
      ...list,
      ...form,
    ],
  },
]
