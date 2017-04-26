import { Transformer as CommonTransformer } from 'common/services'

export default {
  transform: (product) => {
    product.cost = CommonTransformer.monetary(product.cost)
    product.valor = CommonTransformer.monetary(product.valor)

    return product
  }
}
