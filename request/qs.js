
var querystring = require('querystring')


module.exports = (qs, redirect = {}) => ({options}) => {
  if (redirect.followed) {
    return {options}
  }

  if (typeof qs === 'object') {
    qs = JSON.parse(JSON.stringify(qs))

    var [path, query] = options.path.split('?')
    query = querystring.parse(query)

    qs = rfc3986(querystring.stringify(Object.assign(query, qs)))
    options.path = path + (qs ? `?${qs}` : '')
  }
  else if (typeof qs === 'string') {
    var [path, query] = options.path.split('?')
    options.path = path + (query ? `?${query}&${qs}` : `?${qs}`)
  }

  return {options}
}

var rfc3986 = (str) => str.replace(
  /[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase())
