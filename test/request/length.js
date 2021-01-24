
var t = require('assert')
var fs = require('fs')
var path = require('path')
var http = require('http')
var stream = require('stream')

var compose = require('../../')
var Request = {
  length: require('../../request/length'),
}
var multipart = require('request-multipart')

var file = {
  binary: path.resolve(__dirname, '../fixtures/cat.png'),
}


describe('length', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      if (req.url === '/length') {
        res.writeHead(200, {'content-length': 5})
      }
      else if (req.url === '/chunked') {
        res.writeHead(200, {'transfer-encoding': 'chunked'})
      }
      res.end()
    })
    server.listen(5000, done)
  })

  describe('skip', () => {
    it('preserve existing content-length header', async () => {
      var options = {headers: {'content-length': 1}}
      var body = 'λ'
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'content-length': 1},
        'preserve content-length header'
      )
    })

    it('don\'t set content-length if transfer-encoding chunked is set', async () => {
      var options = {headers: {'transfer-encoding': 'chunked'}}
      var body = 'λ'
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'transfer-encoding': 'chunked'},
        'content-length should not be set'
      )
    })
  })

  describe('set', () => {
    it('set content-length for string body', async () => {
      var options = {headers: {}}
      var body = 'λ'
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'content-length': 2},
        'content-length should equal 2'
      )
    })

    it('set content-length for Buffer body', async () => {
      var options = {headers: {}}
      var body = Buffer.from('λ')
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'content-length': 2},
        'content-length should equal 2'
      )
    })

    it('set content-length for fs.ReadStream', async () => {
      var options = {headers: {}}
      var body = fs.createReadStream(file.binary)
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'content-length': fs.statSync(file.binary).size},
        'content-length should equal file size'
      )
    })

    it('set content-length for http.IncomingMessage', async () => {
      var options = {headers: {}}
      var body = (await compose.stream({url: 'http://localhost:5000/length'})).res
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'content-length': 5},
        'content-length should equal response content-length'
      )
    })

    it('set content-length for request-multipart', async () => {
      var options = {headers: {}}
      var body = multipart({
        string: 'λ',
        buffer: Buffer.from('λ'),
      })({options: {headers: {}}}).body

      var items = body._items.join('')
      var fixture = [
        '--8e3e0676-8acc-4f51-a6b3-a5a89fcdebda\r\n',
        'Content-Disposition: form-data; name="string"\r\n',
        'Content-Type: text/plain\r\n\r\n',
        'λ',
        '\r\n',
        '--8e3e0676-8acc-4f51-a6b3-a5a89fcdebda\r\n',
        'Content-Disposition: form-data; name="buffer"\r\n',
        'Content-Type: application/octet-stream\r\n\r\n',
        'λ',
        '\r\n',
        '--8e3e0676-8acc-4f51-a6b3-a5a89fcdebda--'
      ].join('')

      t.equal(Buffer.byteLength(items), 292)
      t.equal(Buffer.byteLength(fixture), 292)
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'content-length': 292}
      )
    })

    it('request-multipart + known length', async () => {
      var options = {headers: {}}
      var body = multipart({
        file: {
          body: fs.createReadStream(file.binary),
          options: {length: 5}
        }
      })({options: {headers: {}}}).body
      t.ok(
        (await Request.length()({options, body})).options.headers['content-length']
          < fs.statSync(file.binary).size,
        'the entire multipart body should be smaller than the file itself'
      )
    })

    it('content-length 0 is allowed', async () => {
      var options = {headers: {}}
      var body = ''
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'content-length': 0},
        'content-length 0 is allowed'
      )
    })
  })

  describe('fallback to transfer-encoding chunked', () => {
    it('not supported body type', async () => {
      var options = {headers: {}}
      var body = null
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'transfer-encoding': 'chunked'},
        'transfer-encoding should be set instead of content-length'
      )
    })

    it('not supported stream type', async () => {
      var options = {headers: {}}
      var body = new stream.Readable()
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'transfer-encoding': 'chunked'},
        'transfer-encoding should be set instead of content-length'
      )
    })

    it('fs error', async () => {
      var stream = fs.createReadStream(file.binary)
      await new Promise((resolve) => setTimeout(resolve))
      stream.path = 'fo'
      var options = {headers: {}}
      var body = stream
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'transfer-encoding': 'chunked'},
        'transfer-encoding should be set instead of content-length'
      )
    })

    it('http.IncomingMessage without content-length header', async () => {
      var options = {headers: {}}
      var body = (await compose.stream({url: 'http://localhost:5000/chunked'})).res
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'transfer-encoding': 'chunked'},
        'should fallback to chunked encoding if no content-length is found'
      )
    })

    it('multipart size fail', async () => {
      var stream = fs.createReadStream(file.binary)
      await new Promise((resolve) => setTimeout(resolve))
      stream.path = 'fo'
      var options = {headers: {}}
      var body = multipart({
        file: stream
      })({options: {headers: {}}}).body
      t.deepStrictEqual(
        (await Request.length()({options, body})).options.headers,
        {'transfer-encoding': 'chunked'},
        'fallback to chunked encoding if any of the multipart size fails'
      )
    })
  })

  after((done) => {
    server.close(done)
  })
})
