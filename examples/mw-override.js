
var compose = require('request-compose')
var qs = require('qs')

// overrides are process-wide!
compose.Response.parse = () => ({res, res: {headers}, body}) => {
  var content = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  if (/application\/x-www-form-urlencoded/.test(headers[content])) {
    // use qs instead of querystring for nested objects
    body = qs.parse(body)
  }

  return {res, body}
}

var http = require('http')


;(async () => {
  var server = await new Promise((resolve) => {
    var server = http.createServer()
    server.on('request', (req, res) => {
      res.writeHead(200, {'content-type': 'application/x-www-form-urlencoded'})
      res.end(qs.stringify({a: {b: {c: '(╯°□°）╯︵ ┻━┻'}}}))
    })
    server.listen(5000, () => resolve(server))
  })
  try {
    var {body} = await compose.client({
      url: 'http://localhost:5000',
    })
    console.log(body)
    server.close()
  }
  catch (err) {
    console.error(err)
  }
})()
