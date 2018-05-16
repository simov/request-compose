
var http = require('http')
var https = require('https')
var stream = require('stream')
var log = require('../utils/log')


module.exports = () => ({options, body}) => new Promise((resolve, reject) => {

  var req =
    (/https/.test(options.protocol) ? https : http)
      .request(options)
        .on('response', (res) => {
          log({res})
          resolve({options, res})
        })
        .on('error', reject)
        .on('timeout', () => {
          var err = new Error('request-compose: timeout')
          err.code = 'ETIMEDOUT'
          req.emit('error', err)
          req.abort()
        })
        .setTimeout(options.timeout)

  ;(body instanceof stream.Stream)
    ? body.pipe(req)
    : req.end(body)

  log({req, body, options})

})
