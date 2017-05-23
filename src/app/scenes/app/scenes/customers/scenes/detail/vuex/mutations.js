import { default as ProductTransformer } from '../../../transformer'

export default {
  'products/detail/PRODUCT_RECEIVED' (state, product) {
    state.product = ProductTransformer.transform(product)
  },

  'products/detail/depots/RECEIVED' (state, depot) {
    state.depot = depot
  },

  'products/detail/depots/serials/RECEIVED' (state, serials) {
    state.serials = serials
  },
}
