
var url = require('url')
var querystring = require('querystring')
var error = require('../utils/error')


module.exports = () => ({options, res, body, raw}) => {

  if (/patch|put|post|delete/i.test(options.method)) {
    // do not follow redirects
    return {res, body, raw}
  }

  var header = Object.keys(res.headers)
    .find((name) => name.toLowerCase() === 'location')

  var location = res.headers[header]
  if (!/^https?:/.test(location)) {
    location = url.resolve(
      options.protocol + '//' + options.hostname +
      (options.port && options.port !== 80 ? `:${options.port}` : ''),
      location
    )
  }
  var [path, query] = options.path.split('?')
  if (query) {
    location += `?${query}`
  }

  var err = error({res, body, raw})
  err.message = 'request-compose: redirect'
  err.location = location
  throw err

}
