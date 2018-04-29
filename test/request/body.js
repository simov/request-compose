
var t = require('assert')
var fs = require('fs')
var path = require('path')
var http = require('http')

var compose = require('../../')

var file = {
  text: path.resolve(__dirname, './body.js'),
  binary: path.resolve(__dirname, '../fixtures/cat.png'),
}

describe('body', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      if (req.url === '/stream') {
        t.equal(
          req.headers['transfer-encoding'],
          'chunked',
          'transfer encoding should be chunked'
        )
      }
      else {
        t.equal(
          req.headers['content-length'],
          '2',
          'content-length should be set'
        )
      }
      req.pipe(res)
    })
    server.listen(5000, done)
  })

  it('string', async () => {
    var {body} = await compose.client({
      url: 'http://localhost:5000',
      body: 'λ',
    })
    t.equal(
      body,
      'λ',
      'string request body'
    )
  })

  it('buffer', async () => {
    var {body} = await compose.client({
      url: 'http://localhost:5000',
      body: Buffer.from('λ'),
    })
    t.equal(
      body,
      'λ',
      'Buffer request body'
    )
  })

  it('stream text', async () => {
    var {body} = await compose.buffer({
      url: 'http://localhost:5000/stream',
      body: fs.createReadStream(file.text, {highWaterMark: 1024}),
    })
    t.equal(
      fs.statSync(file.text).size,
      body.length,
      'input file size should equal response body length'
    )
  })

  it('stream binary', async () => {
    var {body} = await compose.buffer({
      url: 'http://localhost:5000/stream',
      body: fs.createReadStream(file.binary, {highWaterMark: 1024}),
    })
    t.equal(
      fs.statSync(file.binary).size,
      body.length,
      'input file size should equal response body length'
    )
  })

  after((done) => {
    server.close(done)
  })

})
