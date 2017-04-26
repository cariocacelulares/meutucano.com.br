const intlMonetary = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

export default {
  /**
  * Monetary formatter config
  * Usage: monetary.fomat(9.99) // R$9,99
  *
  * @type {Intl}
  */
  monetary: (value) => intlMonetary.format(value),
}
