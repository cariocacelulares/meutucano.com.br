/**
 * Monetary formatter config
 * Usage: monetary.fomat(9.99) // R$9,99
 *
 * @type {Intl}
 */
window.monetary = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

/**
 * Date formatter config
 * Usage: dating.fomat(9.99) // R$9,99
 *
 * @type {Intl}
 */
/*window.dating = new Intl.DateTimeFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});*/
