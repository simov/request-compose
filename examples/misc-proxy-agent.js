
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

var request = require('../').client
var proxy = require('proxy-agent')

var agent = new proxy('http://localhost:8009')

;(async () => {
  var {res, body} = await request({
    url: 'https://grant.outofindex.com/providers',
    agent,
  })
  console.log(body)
})()
