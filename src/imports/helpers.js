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
