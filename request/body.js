
var stream = require('stream')


module.exports = (body) => ({options}) => {

  if (body instanceof stream.Stream) {
    options.headers['transfer-encoding'] = 'chunked'
  }

  return {options, body}
}
