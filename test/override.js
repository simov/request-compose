
var t = require('assert')
var http = require('http')
var qs = require('qs')

var request1 = require('../').override({
  Request: {
    qs: (_qs) => ({options}) => {
      options.path += `?${qs.stringify(_qs)}`
      return {options}
    }
  }
}).client

var request2 = require('../').client


describe('override', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.end(req.url.replace('/?', ''))
    })
    server.listen(5000, done)
  })

  it('qs.stringify', async () => {
    var {body} = await request1({
      url: 'http://localhost:5000',
      qs: {a: {b: {c: 'd'}}},
    })
    t.deepEqual(
      qs.parse(body),
      {a: {b: {c: 'd'}}},
      'should use the overridden qs middleware'
    )
  })

  it('querystring.stringify', async () => {
    var {body} = await request2({
      url: 'http://localhost:5000',
      qs: {a: {b: {c: 'd'}}},
    })
    t.deepEqual(
      qs.parse(body),
      {a: ''},
      'should use the default qs middleware'
    )
  })

  after((done) => server.close(done))

})
