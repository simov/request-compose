
var t = require('assert')
var http = require('http')
var cp = require('child_process')


var defaults =
`req POST http://localhost:5000/1
    content-length: 1
    Host:           localhost:5000
body
a
req POST http://localhost:5000/2
    content-length: 1
    Host:           localhost:5000
body
b
req POST http://localhost:5000/3
    content-length: 1
    Host:           localhost:5000
body
c
res 200 OK
    date:              noop
    connection:        close
    transfer-encoding: chunked
body
2
res 200 OK
    date:              noop
    connection:        close
    transfer-encoding: chunked
body
3
res 200 OK
    date:              noop
    connection:        close
    transfer-encoding: chunked
body
1
`

var sync =
`req POST http://localhost:5000/2
    content-length: 1
    Host:           localhost:5000
body
b
res 200 OK
    date:              noop
    connection:        close
    transfer-encoding: chunked
body
2
req POST http://localhost:5000/3
    content-length: 1
    Host:           localhost:5000
body
c
res 200 OK
    date:              noop
    connection:        close
    transfer-encoding: chunked
body
3
req POST http://localhost:5000/1
    content-length: 1
    Host:           localhost:5000
body
a
res 200 OK
    date:              noop
    connection:        close
    transfer-encoding: chunked
body
1
`

var cases = {

  'req,res,body': defaults,

  'req,res,body,sync': sync,

}

var test = (flags) => (done) => {
  process.env.DEBUG = flags + ',nocolor'

  var output = ''
  cp.spawn('node', [
    '-e', `
      var request = require('../../').client
      ;(async () => {
        await Promise.all([
          request({method: 'POST', url: 'http://localhost:5000/1', body: 'a'}),
          request({method: 'POST', url: 'http://localhost:5000/2', body: 'b'}),
          request({method: 'POST', url: 'http://localhost:5000/3', body: 'c'}),
        ])
      })()
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


describe('logs-sync', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.writeHead(200, {date: 'noop'})
      if (/1/.test(req.url)) {
        setTimeout(() => res.end('1'), 500)
      }
      else if (/2/.test(req.url)) {
        setTimeout(() => res.end('2'), 100)
      }
      else if (/3/.test(req.url)) {
        setTimeout(() => res.end('3'), 300)
      }
    })
    server.listen(5000, done)
  })

  for (var flags in cases) {
    it(flags, test(flags))
  }

  after((done) => server.close(done))

})
