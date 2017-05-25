import { vuex as products } from './scenes/products'
import { vuex as orders } from './scenes/orders'
import { vuex as customers } from './scenes/customers'
import { vuex as users } from './scenes/users'
import { vuex as brands } from './scenes/brands'
import { vuex as lines } from './scenes/lines'
import { vuex as depots } from './scenes/depots'

export default [
  ...products,
  ...orders,
  ...customers,
  ...users,
  ...brands,
  ...lines,
  ...depots,
]
