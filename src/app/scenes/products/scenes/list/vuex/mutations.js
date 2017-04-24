export default {
  'products/list/RECEIVED' (state, products) {
    products = products.map((product) => {
      if (typeof(product.custo) == 'number') {
        product.custo = monetary.format(product.custo)
      }

      if (typeof(product.valor) == 'number') {
        product.valor = monetary.format(product.valor)
      }

      return product
    })

    state.products = products
  },
}
