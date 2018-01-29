
var t = require('assert')
var http = require('http')

var compose = require('../')
var Request = compose.Request
var Response = compose.Response


describe('middlewares', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.writeHead(200, 'OK', {
        'content-type': 'application/json'
      })
      res.end(JSON.stringify({a: 1}))
    })
    server.listen(5000, done)
  })

  it('request', async () => {
    var {res, body} = await compose(
      Request.defaults(),
      Request.url('http://localhost:5000'),
      Request.send(),
      Response.buffer(),
      Response.parse(),
    )()
    t.equal(res.statusCode, 200)
    t.equal(res.statusMessage, 'OK')
    t.deepStrictEqual(body, {a: 1})
  })

  after((done) => server.close(done))

})
