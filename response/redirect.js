
var url = require('url')
var error = require('../utils/error')


module.exports = (args, client) => ({options, res, body, raw}) => {

  if (!/^3/.test(res.statusCode)) {
    // not a redirect
    return {options, res, body, raw}
  }

  if (/patch|put|post|delete/i.test(options.method)) {
    // do not follow redirects
    return {options, res, body, raw}
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

  if (!args.redirects || args.redirects <= 2) {
    return client(Object.assign({}, args, {
      url: location,
      redirects: (args.redirects || 1) + 1,
    }))
  }
  else {
    var err = error({res, body, raw})
    err.message = 'request-compose: exceeded maximum redirects'
    throw err
  }

}
