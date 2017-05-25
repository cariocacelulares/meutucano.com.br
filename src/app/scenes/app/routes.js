import App from './components/App'
import { routes as dashboard } from './scenes/dashboard'
import { routes as products } from './scenes/products'
import { routes as orders } from './scenes/orders'
import { routes as customers } from './scenes/customers'
import { routes as users } from './scenes/users'
import { routes as brands } from './scenes/brands'
import { routes as lines } from './scenes/lines'
import { routes as depots } from './scenes/depots'

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
      ...brands,
      ...lines,
      ...depots,
    ]
  },
]
