
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


describe('multipart', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      var body = ''
      req.on('data', (chunk) => {
        body += chunk
      })
      req.on('end', () => {
        t.ok(
          !body.indexOf(
            '--XXX\r\n' +
            'Content-Disposition: form-data; name="string"\r\n' +
            'Content-Type: text/plain\r\n' +
            '\r\n' +
            'value\r\n' +
            '--XXX\r\n' +
            'Content-Disposition: form-data; name="file"\r\n' +
            'Content-Type: application/octet-stream\r\n' +
            '\r\n' +
            '�PNG\r\n'
          ),
          'should start with the string and file body parts'
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
        file: fs.readFileSync(file.binary),
      }
    })
  })

  after((done) => {
    server.close(done)
  })

})
