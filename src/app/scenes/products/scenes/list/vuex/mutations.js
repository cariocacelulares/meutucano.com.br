export default {
  'products/list/RECEIVED' (state, products) {
    products = products.map((product) => {
      if (typeof(product.custo) == 'number') {
        product.cost = monetary.format(product.cost)
      }

      if (typeof(product.valor) == 'number') {
        product.valor = monetary.format(product.valor)
      }

      return product
    })

    state.products = products
  },
}
