
var compose = require('../')
var qs = require('qs')

// process-wide override, unless extend was called after that
compose.Request.form = (form) => ({options, options: {headers}}) => {
  headers['content-type'] = 'application/x-www-form-urlencoded'
  // use qs instead of querystring for nested objects
  return {options, body: qs.stringify(form)}
}
// process-wide override, unless extend was called after that
compose.Response.parse = () => ({options, res, res: {headers}, body, raw}) => {
  var content = Object.keys(headers).find((name) => /content-type/i.test(name))
  if (/application\/x-www-form-urlencoded/.test(headers[content])) {
    // use qs instead of querystring for nested objects
    raw = body
    body = qs.parse(body)
  }
  return {options, res, body, raw}
}

var http = require('http')

;(async () => {
  var server = await new Promise((resolve) => {
    var server = http.createServer()
    server.on('request', (req, res) => {
      var body = ''
      req.on('data', (chunk) => body += chunk)
      req.on('end', () => {
        res.writeHead(200, {'content-type': 'application/x-www-form-urlencoded'})
        res.end(body)
      })
    })
    server.listen(5000, () => resolve(server))
  })
  try {
    var {body} = await compose.client({
      url: 'http://localhost:5000',
      form: {a: {b: {c: '(╯°□°）╯︵ ┻━┻'}}},
    })
    console.log(body)
    server.close()
  }
  catch (err) {
    console.error(err)
  }
})()
