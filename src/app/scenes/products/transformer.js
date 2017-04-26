import { default as CommonTransformer } from 'common/transformer'

export default {
  transform: (product) => {
    product.cost = CommonTransformer.monetary(product.cost)
    product.valor = CommonTransformer.monetary(product.valor)

    return product
  }
}
