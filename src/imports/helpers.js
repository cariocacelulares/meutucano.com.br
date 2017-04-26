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

window.parseParams = (params) => {
  var parsed = '?';

  for (var key in params) {
    if (parsed != '?') {
      parsed += '&';
    }

    parsed += `${key}=` + encodeURIComponent(params[key]);
  }

  return parsed
}
