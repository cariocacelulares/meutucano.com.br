import App from './components/App'
import { routes as dashboard } from './scenes/dashboard'
import { routes as products } from './scenes/products'
import { routes as orders } from './scenes/orders'

export default [
  {
    path: '/',
    name: 'app',
    component: App,
    meta: {
      auth: true,
      breadcrumb: 'Dashboard'
    },
    redirect: '/dashboard',
    children: [
      ...dashboard,
      ...products,
      ...orders,
    ]
  },
]
