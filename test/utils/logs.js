
var t = require('assert')
var http = require('http')
var cp = require('child_process')


var req = {}
var res = {}

req.head =
`req POST http://localhost:5000/
    content-type:   application/json
    content-length: 16
    Host:           localhost:5000`

req.body =
`body
{"client":"hey"}`

req.json =
`json
    client: hey`

res.head =
`res 200 OK
    content-type:      application/json
    date:              noop
    connection:        close
    transfer-encoding: chunked`

res.body =
`body
{"server":"hi"}`

res.json =
`json
    server: hi`


var join = (...fixtures) => fixtures.join('\n') + '\n'


var cases = {

  'req,res,body,json': join(
    req.head, req.body, req.json, res.head, res.body, res.json),

  'req,res,body': join(req.head, req.body, res.head, res.body),

  'req,res,json': join(req.head, req.json, res.head, res.json),

  'req,body': join(req.head, req.body),

  'req,json': join(req.head, req.json),

  'res,body': join(res.head, res.body),

  'res,json': join(res.head, res.json),

  'req': join(req.head),

  'res': join(res.head),

  'body': '',

  'json': '',

}


var test = (flags) => (done) => {
  process.env.DEBUG = flags + ',nocolor'

  var output = ''
  cp.spawn('node', [
    '-e', `
      var request = require('../../').client
      request({
        method: 'POST',
        url: 'http://localhost:5000',
        json: {client: 'hey'},
      })
    `,
    ], {
      cwd: __dirname,
    })
  .stdout
    .on('data', (chunk) => {
      output += chunk.toString('utf8')
    })
    .on('end', () => {
      t.equal(output, cases[flags])
      done()
    })
}


describe('logs', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.writeHead(200, 'OK', {
        'content-type': 'application/json',
        date: 'noop'
      })
      res.end(JSON.stringify({server: 'hi'}))
    })
    server.listen(5000, done)
  })

  for (var flags in cases) {
    it(flags, test(flags))
  }

  after((done) => server.close(done))

})
