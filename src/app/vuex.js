import { vuex as sign } from './scenes/sign'
import { vuex as products } from './scenes/products'
import { vuex as orders } from './scenes/orders'

export default [
  ...sign,
  ...products,
  ...orders,
]
