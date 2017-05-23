import { isEmpty } from 'lodash'

/**
 * Parse params object to url params stromg
 * @param  {Object} params
 * @return {String}
 */
window.parseParams = (params) => {
  var parsed = '?'
  var value = null

  for (var key in params) {
    if (params[key] && typeof(params[key]) == 'object') {
      if (Object.prototype.toString.call(params[key]) == '[object Array]') {
        params[key] = params[key].join('&')
      } else {
        const clearedObj = {}
        for(var index in params[key]) {
          clearedObj[index] = params[key][index]
        }

        params[key] = JSON.stringify(clearedObj)
      }
    }

    value = encodeURIComponent(params[key])

    if (value && value != 'null') {
      if (parsed != '?') {
        parsed += '&'
      }

      parsed += `${key}=${value}`
    }
  }

  return parsed
}

/**
 * Return only valid values from an array
 * @param  {Array} array
 * @return {Array}
 */
window.notEmpty = (array) => {
  return array.filter((item) => {
    if (typeof(item) === 'boolean' || !isEmpty(item)) {
      return item.trim()
    }
  })
}

/**
 * If http response is a validation fail
 * @param  {Object} response
 * @return {Boolean}
 */
window.validationFail = (response) => {
  return (response.status == 'ValidationFail' || response.code == 400)
}

/**
 * A array with month names
 * @type {Array}
 */
window.monthList = (short = false) => {
  if (short) {
    return [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez'
    ]
  }

  return [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]
}
