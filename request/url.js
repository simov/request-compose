
var url = require('url')


module.exports = (uri) => ({options}) => {

  uri = typeof uri === 'string' ? url.parse(uri) : uri

  options.protocol = uri.protocol
  options.hostname = uri.hostname
  options.port = uri.port
  options.path = uri.path

  return {options}
}
