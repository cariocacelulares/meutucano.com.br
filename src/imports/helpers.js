import { isEmpty } from 'lodash'

/**
 * Parse params object to url params stromg
 * @param  {Object} params
 * @return {String}
 */
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
