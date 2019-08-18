
var url = require('url')


module.exports = (proxy) => ({options}) => {

  options.path = (() => {
    var path = `${options.protocol}//${options.hostname}`
    if (options.port && !/^(?:80|443)$/.test(options.port)) {
      path += `:${options.port}`
    }
    path += options.path
    return path
  })()

  options.headers.host = options.hostname

  var uri = typeof proxy === 'string' ? url.parse(proxy) : proxy
  options.protocol = uri.protocol
  options.hostname = uri.hostname
  options.port = uri.port

  return {options}
}
