import { default as CommonTransformer } from 'common/transformer'

export default {
  transform: (product) => {
    product.cost = CommonTransformer.monetary(product.cost)
    product.price = CommonTransformer.monetary(product.price)

    product.created_at = CommonTransformer.date(product.created_at)
    product.updated_at = CommonTransformer.date(product.updated_at)

    return product
  }
}
