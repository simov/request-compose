
var http = require('http')
var https = require('https')
var log = require('../utils/log')


module.exports = () => ({options, body}) => new Promise((resolve, reject) => {

  var req =
    (/https/.test(options.protocol) ? https : http)
      .request(options)
        .on('response', (res) => {
          log({res})
          resolve({res})
        })
        .on('error', reject)

  req.end(body)

  log({req, body, options})

})
