
var t = require('assert')
var http = require('http')
var zlib = require('zlib')

var compose = require('../')


describe('buffer', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      if (req.headers['accept-encoding'] === 'gzip, deflate') {
        res.setHeader('content-encoding', 'gzip')
        res.end(zlib.gzipSync('hey'))
      }
      else {
        res.end('hey')
      }
    })
    server.listen(5000, done)
  })

  it('buffer', async () => {
    var {body} = await compose.buffer({
      url: 'http://localhost:5000',
    })
    t.ok(
      body instanceof Buffer,
      'body should be buffer'
    )
    t.equal(
      body.length,
      3,
      'buffer length should equal the string length'
    )
  })

  it('gzip', async () => {
    var {body} = await compose.buffer({
      url: 'http://localhost:5000',
      headers: {'accept-encoding': 'gzip, deflate'}
    })
    t.ok(
      body instanceof Buffer,
      'body should be buffer'
    )
    t.equal(
      body.length,
      3,
      'gzipped buffer should be decoded'
    )
  })

  after((done) => server.close(done))

})
