
var t = require('assert')
var http = require('http')

var request = require('../').client


describe('client', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      t.equal(req.method, 'POST')
      t.equal(req.headers['content-type'], 'application/json')
      t.equal(req.headers['content-length'], 16)
      var body = ''
      req.on('data', (chunk) => body += chunk)
      req.on('end', () => {
        t.deepStrictEqual(JSON.parse(body), {client: 'hey'})
        res.writeHead(200, 'OK', {'content-type': 'application/json'})
        res.end(JSON.stringify({server: 'hi'}))
      })
    })
    server.listen(5000, done)
  })

  it('opinions', async () => {
    var {res, body} = await request({
      method: 'POST',
      url: 'http://localhost:5000',
      json: {client: 'hey'},
    })
    t.equal(res.statusCode, 200)
    t.equal(res.statusMessage, 'OK')
    t.deepStrictEqual(body, {server: 'hi'})
  })

  it('without url', async () => {
    var {res, body} = await request({
      method: 'POST',
      protocol: 'http:',
      hostname: 'localhost',
      port: 5000,
      path: '',
      json: {client: 'hey'},
    })
    t.equal(res.statusCode, 200)
    t.equal(res.statusMessage, 'OK')
    t.deepStrictEqual(body, {server: 'hi'})
  })

  after((done) => server.close(done))

})
