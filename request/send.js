
var http = require('http')
var https = require('https')


module.exports = () => ({options, body}) => new Promise((resolve, reject) => {

  var req =
    (/https/.test(options.protocol) ? https : http)
      .request(options)
        .on('response', (res) => {
          process.env.DEBUG && require('request-logs')({res})
          resolve({res})
        })
        .on('error', reject)

  req.end(body)

  process.env.DEBUG && require('request-logs')({req, body, options})

})
