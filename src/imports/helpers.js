/**
 * Monetary formatter config
 * Usage: formatter.fomat(9.99) // R$9,99
 *
 * @type {Intl}
 */
window.formatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});
