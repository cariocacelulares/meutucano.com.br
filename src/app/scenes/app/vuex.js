import { vuex as products } from './scenes/products'
import { vuex as orders } from './scenes/orders'
import { vuex as customers } from './scenes/customers'
import { vuex as users } from './scenes/users'

export default [
  ...products,
  ...orders,
  ...customers,
  ...users,
]
