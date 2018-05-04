
var t = require('assert')
var fs = require('fs')
var path = require('path')
var http = require('http')

var compose = require('../')
var file = {
  binary: path.resolve(__dirname, './fixtures/cat.png'),
}


describe('stream', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      t.equal(
        req.headers['content-length'],
        '17552',
        'content-length should be set'
      )
      if (req.url === '/redirect') {
        res.writeHead(301, {location: 'http://localhost:5000'})
        res.end()
      }
      else {
        res.writeHead(200, {'content-length': fs.statSync(file.binary).size})
        req.pipe(res)
      }
    })
    server.listen(5000, done)
  })

  it('file -> req -> file', async () => {
    var {body} = await compose.buffer({
      url: 'http://localhost:5000',
      body: fs.createReadStream(file.binary, {highWaterMark: 1024}),
    })
    t.equal(
      fs.statSync(file.binary).size,
      body.length,
      'input file size should equal response body length'
    )
  })

  it('file -> req -> req -> file', async () => {
    var {res} = await compose.stream({
      url: 'http://localhost:5000',
      body: fs.createReadStream(file.binary, {highWaterMark: 1024}),
    })
    var {body} = await compose.buffer({
      url: 'http://localhost:5000',
      body: res,
    })
    t.equal(
      fs.statSync(file.binary).size,
      body.length,
      'input file size should equal response body length'
    )
  })

  it.skip('file -> req -> redirect -> req -> file', async () => {
    var {res} = await request({
      url: 'http://localhost:5000/redirect',
      body: fs.createReadStream(file.binary, {highWaterMark: 1024}),
    })
    await new Promise((resolve) => {
      var body = []
      res.on('data', (chunk) => {
        body.push(chunk)
      })
      res.on('end', () => {
        t.equal(
          fs.statSync(file.binary).size,
          Buffer.concat(body).length,
          'input file size should equal response body length'
        )
        resolve()
      })
    })
  })

  after((done) => server.close(done))

})
