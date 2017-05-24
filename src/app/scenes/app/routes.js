import App from './components/App'
import { routes as dashboard } from './scenes/dashboard'
import { routes as products } from './scenes/products'
import { routes as orders } from './scenes/orders'
import { routes as customers } from './scenes/customers'
import { routes as users } from './scenes/users'

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
      ...customers,
      ...users,
    ]
  },
]
