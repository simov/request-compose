
var querystring = require('querystring')


module.exports = (form) => ({options, options: {headers}}) => {

  form = typeof form === 'object' ? querystring.stringify(form) : (form || '')

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  if (!header) {
    headers['content-type'] = 'application/x-www-form-urlencoded'
  }

  return {options, body: rfc3986(form)}
}

var rfc3986 = (str) => str.replace(
  /[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
