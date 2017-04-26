import { default as ProductTransformer } from '../../../transformer'

export default {
  'products/list/RECEIVED' (state, products) {
    products = products.map((product) =>
      ProductTransformer.transform(product)
    )

    state.products = products
  },
}
