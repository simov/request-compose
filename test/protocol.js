
var t = require('assert')
var fs = require('fs')
var path = require('path')
var http = require('http')
var https = require('https')

var credentials = {
  key: fs.readFileSync(path.resolve(__dirname, './ssl/private.pem'), 'utf8'),
  cert: fs.readFileSync(path.resolve(__dirname, './ssl/public.pem'), 'utf8'),
}

var request = require('../').client


describe('protocol', () => {
  var httpServer, httpsServer

  before(async () => {
    await new Promise((resolve) => {
      httpServer = http.createServer()
      httpServer.on('request', (req, res) => {
        res.writeHead(200, 'HTTP')
        res.end()
      })
      httpServer.listen(5001, resolve)
    })
    await new Promise((resolve) => {
      httpsServer = https.createServer(credentials)
      httpsServer.on('request', (req, res) => {
        res.writeHead(200, 'HTTPS')
        res.end()
      })
      httpsServer.listen(5002, resolve)
    })
  })

  it('http', async () => {
    var {res} = await request({
      url: 'http://localhost:5001',
    })
    t.equal(res.statusCode, 200)
    t.equal(res.statusMessage, 'HTTP')
  })

  it('https', async () => {
    var {res} = await request({
      url: 'https://localhost:5002',
      rejectUnauthorized: false,
    })
    t.equal(res.statusCode, 200)
    t.equal(res.statusMessage, 'HTTPS')
  })

  after((done) => httpServer.close(() => httpsServer.close(done)))

})
