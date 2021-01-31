
var t = require('assert')
var fs = require('fs')
var path = require('path')
var http = require('http')

var compose = require('../../')
compose.Request.multipart = require('request-multipart')
var request = compose.client

var file = {
  binary: path.resolve(__dirname, '../fixtures/cat.png'),
}

var header =
  '--XXX\r\n' +
  'Content-Disposition: form-data; name="string"\r\n' +
  'Content-Type: text/plain\r\n' +
  '\r\n' +
  'value\r\n' +
  '--XXX\r\n' +
  'Content-Disposition: form-data; name="file"; filename="cat.png"\r\n' +
  'Content-Type: image/png\r\n' +
  '\r\n'
var footer =
  '\r\n--XXX--'


describe('multipart', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      t.equal(
        req.headers['content-length'],
        header.length + fs.statSync(file.binary).size + footer.length,
        'content length should equal multipart header + file size + footer'
      )
      var body = ''
      req.on('data', (chunk) => body += chunk)
      req.on('end', () => {
        t.ok(
          !body.indexOf(header + '�PNG\r\n'),
          'should start with multipart header followed by file body'
        )
        res.end()
      })
    })
    server.listen(5000, done)
  })

  it('middleware', async () => {
    var {body} = await request({
      url: 'http://localhost:5000',
      headers: {'content-type': 'multipart/form-data; boundary=XXX'},
      multipart: {
        string: 'value',
        file: fs.createReadStream(file.binary),
      }
    })

    var {body} = await request({
      url: 'http://localhost:5000',
      headers: {'content-type': 'multipart/form-data; boundary=XXX'},
      multipart: {
        string: 'value',
        file: {
          body: fs.readFileSync(file.binary),
          options: {name: 'cat.png', type: 'image/png'}
        }
      }
    })
  })

  after((done) => {
    server.close(done)
  })

})
