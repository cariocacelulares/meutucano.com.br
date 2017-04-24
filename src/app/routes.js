import { routes as sign } from './scenes/sign'
import { routes as dashboard } from './scenes/dashboard'
import { routes as products } from './scenes/products'
import { routes as orders } from './scenes/orders'

export default [
  ...sign,
  ...dashboard,
  ...products,
  ...orders,
];
