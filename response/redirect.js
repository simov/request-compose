
var url = require('url')
var error = require('../utils/error')


module.exports = (args, client) => ({options, res, body, raw}) => {

  if (!/^3/.test(res.statusCode)) {
    // not a redirect
    return {options, res, body, raw}
  }

  var defaults = {
    max: 3,
    all: false,
    method: true,
    referer: false,
    auth: true,
    followed: 0,
    hostname: options.hostname,
  }

  var redirect = Object.assign(defaults, args.redirect)

  var header = Object.keys(res.headers)
    .find((name) => name.toLowerCase() === 'location')

  var location = res.headers[header]

  if (!location || (!redirect.all && /patch|put|post|delete/i.test(options.method))) {
    // do not follow redirects
    return {options, res, body, raw}
  }

  // relative location
  if (!/^https?:/.test(location)) {
    location = url.resolve(
      options.protocol + '//' + options.hostname +
      (options.port && options.port !== 80 ? `:${options.port}` : ''),
      location.startsWith('/')
        ? location
        : (options.path + `/${location}`).replace(/\/{2,}/g, '/')
    )
  }

  // args
  var copy = Object.assign({}, args, {url: location, redirect})
  copy.headers = JSON.parse(JSON.stringify(copy.headers || {}))

  // remove authorization
  if (!redirect.auth && redirect.hostname !== url.parse(location).hostname) {
    var header = Object.keys(copy.headers)
      .find((name) => name.toLowerCase() === 'authorization')
    if (header) {
      delete copy.headers[header]
    }
    delete copy.auth
    delete copy.oauth
  }

  // switch to safe method
  if (!redirect.method && /patch|put|post|delete/i.test(options.method)) {
    copy.method = 'GET'
  }

  // set referer
  if (redirect.referer) {
    copy.headers.referer = url.resolve(
      options.protocol + '//' + options.hostname +
      (options.port && options.port !== 80 ? `:${options.port}` : ''),
      options.path
    )
  }

  // redirect
  if (redirect.followed < redirect.max) {
    redirect.followed++
    return client(copy)
  }
  else {
    var err = error({res, body, raw})
    err.message = 'request-compose: exceeded maximum redirects'
    throw err
  }

}
