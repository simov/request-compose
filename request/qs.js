
var querystring = require('querystring')


module.exports = (qs) => ({options}) => {

  qs = typeof qs === 'object' ? qs : querystring.parse(qs)

  var [path, query] = options.path.split('?')
  query = querystring.parse(query)

  qs = rfc3986(querystring.stringify(
    JSON.parse(JSON.stringify(Object.assign(query, qs)))))

  options.path = path + (qs ? `?${qs}` : '')
  return {options}
}

var rfc3986 = (str) => str.replace(
  /[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
