
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

var request = require('../').client
var tunnel = require('tunnel')

var agent = tunnel.httpsOverHttp({
  proxy: {host: 'localhost', port: 8009}
})

;(async () => {
  var {res, body} = await request({
    url: 'https://grant.outofindex.com/providers',
    agent,
  })
  console.log(body)
})()
