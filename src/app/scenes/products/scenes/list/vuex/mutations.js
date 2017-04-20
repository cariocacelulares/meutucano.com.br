export default {
  'products/list/RECEIVED' (state, products) {
    products = products.map((product) => {
      if (typeof(product.custo) == 'number') {
        product.custo = formatter.format(product.custo)
      }

      if (typeof(product.valor) == 'number') {
        product.valor = formatter.format(product.valor)
      }

      return product
    })

    state.products = products
  },
}
