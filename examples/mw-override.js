
var compose = require('../')
var qs = require('qs')
var http = require('http')

var Response = compose.Response
var request = compose.client

// overrides are process-wide!
Response.parse = () => ({res, res: {headers}, body}) => {
  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  var raw = body

  if (/json|javascript/.test(headers[header])) {
    try {
      body = JSON.parse(body)
    }
    catch (err) {}
  }

  else if (/application\/x-www-form-urlencoded/.test(headers[header])) {
    try {
      // use qs instead of querystring for nested objects
      body = qs.parse(body)
    }
    catch (err) {}
  }

  // some providers return wrong `content-type` like: text/html or text/plain
  else {
    try {
      body = JSON.parse(body)
    }
    catch (err) {
      // use qs instead of querystring for nested objects
      body = qs.parse(body)
    }
  }

  return {res, body, raw}
}


;(async () => {
  var server

  await new Promise((resolve) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.writeHead(200, {'content-type': 'text/plain'})
      res.end(qs.stringify({a: {b: {c: '(╯°□°）╯︵ ┻━┻'}}}))
    })
    server.listen(5000, resolve)
  })

  var {body} = await request({
    url: 'http://localhost:5000',
  })
  console.log(body)

  server.close()
})()
