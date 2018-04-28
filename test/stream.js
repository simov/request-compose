
var t = require('assert')
var fs = require('fs')
var path = require('path')
var http = require('http')

var request = require('../').stream
var file = {
  text: path.resolve(__dirname, '../README.md'),
  binary: path.resolve(__dirname, './fixtures/cat.png'),
}


describe('stream', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      if (req.url === '/redirect') {
        res.writeHead(301, {location: 'http://localhost:5000'})
        res.end()
      }
      else {
        req.pipe(res)
      }
    })
    server.listen(5000, done)
  })

  it('file -> req -> file', async () => {
    var {res} = await request({
      url: 'http://localhost:5000',
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

  it('file -> req -> req -> file', async () => {
    var {res:res1} = await request({
      url: 'http://localhost:5000',
      body: fs.createReadStream(file.binary, {highWaterMark: 1024}),
    })
    var {res:res2} = await request({
      url: 'http://localhost:5000',
      body: res1,
    })
    await new Promise((resolve) => {
      var body = []
      res2.on('data', (chunk) => {
        body.push(chunk)
      })
      res2.on('end', () => {
        t.equal(
          fs.statSync(file.binary).size,
          Buffer.concat(body).length,
          'input file size should equal response body length'
        )
        resolve()
      })
    })
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
