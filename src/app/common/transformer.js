import { isEmpty } from 'lodash'

const intlMonetary = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

export default {
  /**
   * Monetary formatter conversion
   * Usage: monetary.fomat(9.99) // R$9,99
   * @param  {Number} value
   * @return {String}
   */
  monetary: (value) => {
    if (typeof(value) == 'number') {
      value = parseFloat(value)
    }

    return intlMonetary.format(value)
  },

  /**
   * Date formatter
   * @param  {String} value
   * @return {String}
   */
  date: (value) => {
    if (isEmpty(value) || value === null) {
      return null
    }

    const date = new Date(value);
    if (date != 'Invalid Date') {
      return date.toLocaleString('pt-BR')
    }

    return value
  },

  /**
   * Data diff for humans
   * @param  {String | Date} date
   * @return {String}
   */
  humanDiff: (date) => {
    return moment(date).fromNow()
  }
}
