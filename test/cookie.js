
var t = require('assert')
var http = require('http')

var compose = require('../')
compose.Request.cookie = require('request-cookie').Request
compose.Response.cookie = require('request-cookie').Response


describe('cookie', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      if (req.url === '/set-cookie') {
        res.setHeader('set-cookie', 'a=b')
        res.end()
      }
      else if (req.url === '/cookie') {
        res.end(req.headers.cookie)
      }
    })
    server.listen(5000, done)
  })

  it('client', async () => {
    var cookie = {}
    await compose.client({
      url: 'http://localhost:5000/set-cookie',
      cookie,
    })
    t.equal(
      cookie.store.getCookieStringSync('http://localhost:5000'),
      'a=b',
      'set-cookie should be stored'
    )
  })

  it('buffer', async () => {
    var cookie = {}
    await compose.buffer({
      url: 'http://localhost:5000/set-cookie',
      cookie,
    })
    t.equal(
      cookie.store.getCookieStringSync('http://localhost:5000'),
      'a=b',
      'set-cookie should be stored'
    )
  })

  it('stream', async () => {
    var cookie = {}
    await compose.stream({
      url: 'http://localhost:5000/set-cookie',
      cookie,
    })
    t.equal(
      cookie.store.getCookieStringSync('http://localhost:5000'),
      'a=b',
      'set-cookie should be stored'
    )
  })

  it('cookie header', async () => {
    var cookie = {}
    await compose.client({
      url: 'http://localhost:5000/set-cookie',
      cookie,
    })
    var {body} = await compose.client({
      url: 'http://localhost:5000/cookie',
      cookie,
    })
    t.equal(
      body,
      'a=b',
      'cookie header should be set'
    )
  })

  after((done) => {
    server.close(done)
  })

})
