import { vuex as products } from './scenes/products'
import { vuex as orders } from './scenes/orders'
import { vuex as customers } from './scenes/customers'

export default [
  ...products,
  ...orders,
  ...customers,
]
