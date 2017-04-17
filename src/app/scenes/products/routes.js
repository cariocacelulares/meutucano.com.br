import Products from './components/Products'
import { routes as list } from './scenes/list'

export default [
  {
    path: '/products',
    name: 'products',
    component: Products,
    meta: {
      auth: true,
      breadcrumb: 'Produtos'
    },
    children: [
      ...list,
    ],
  },
]
