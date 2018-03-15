
var t = require('assert')
var http = require('http')
var cp = require('child_process')


var f = {

req:
`req POST http://localhost:5000/
    content-type:   application/json
    content-length: 16
    Host:           localhost:5000`,

reqbody:
`body
{"client":"hey"}`,

res:
`res 200 OK
    content-type:      application/json
    date:              noop
    connection:        close
    transfer-encoding: chunked`,

resbody:
`body
{"server":"hi"}`,

json:
`json
    server: hi`
}

var join = (...fixtures) => fixtures.join('\n') + '\n'


var cases = {

  'req,res,body,json': join(f.req, f.reqbody, f.res, f.resbody, f.json),

  'req,res,body': join(f.req, f.reqbody, f.res, f.resbody),

  'req,res,json': join(f.req, f.res, f.json),

  'req,body': join(f.req, f.reqbody),

  'req,json': join(f.req),

  'res,body': join(f.res, f.resbody),

  'res,json': join(f.res, f.json),

  'req': join(f.req),

  'res': join(f.res),

  'body': '',

  'json': '',

}


var test = (flags) => (done) => {
  process.env.DEBUG = flags + ',nocolor'

  var output = ''
  cp.spawn('node', [
    '-r', '../',
    '-e', `
      var request = require('../').client
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
