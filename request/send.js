
var http = require('http')
var https = require('https')
var stream = require('stream')
var crypto = require('crypto')
var log = require('../utils/log')


module.exports = () => ({options, body}) => new Promise((resolve, reject) => {

  var id = crypto.randomBytes(20).toString('hex')

  var req =
    (/https/.test(options.protocol) ? https : http)
      .request(options)
        .on('response', (res) => {
          res.id = id
          log({send: {res}})
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

  req.id = id
  log({send: {req, body, options}})

})
