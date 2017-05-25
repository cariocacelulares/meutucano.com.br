import Brands from './components/Brands'
import { routes as list } from './scenes/list'

export default [
  {
    redirect: '/brands/list',
    path: '/brands',
    name: 'brands',
    component: Brands,
    meta: {
      auth: true,
      breadcrumb: 'Usuários'
    },
    children: [
      ...list,
    ],
  },
]
