
var querystring = require('querystring')


module.exports = (form) => ({options, options: {headers}}) => {

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  if (!header) {
    headers['content-type'] = 'application/x-www-form-urlencoded'
  }

  var body =
    typeof form === 'string'
      ? form :
    typeof form === 'object'
      ? rfc3986(querystring.stringify(JSON.parse(JSON.stringify(form)))) :
      ''

  return {options, body}
}

var rfc3986 = (str) => str.replace(
  /[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
