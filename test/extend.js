
var t = require('assert')
var http = require('http')
var compose = require('../')


describe('extend', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.end(req.url.replace('/?', ''))
    })
    server.listen(5000, done)
  })

  it('compose', async () => {
    var copy = compose.extend({})
    t.equal(typeof copy, 'function')
    t.equal(
      await compose(
        (a) => a + 2,
        (a) => a * 2,
      )(0),
      4
    )
  })

  it('extend', async () => {
    var qs = () => ({options}) => (options.path += '?qs=2', {options})
    var copy = compose.extend({Request: {qs}})

    var {body} = await compose.client({
      url: 'http://localhost:5000', qs: {qs: 1}
    })
    t.equal(body, 'qs=1')

    var {body} = await copy.client({
      url: 'http://localhost:5000', qs: {qs: 1}
    })
    t.equal(body, 'qs=2')
  })

  it('deep extend', async () => {
    var qs = () => ({options}) => (options.path += '?qs=1', {options})
    var c1 = compose.extend({Request: {qs}})
    var {body} = await c1.client({url: 'http://localhost:5000', qs: {}})
    t.equal(body, 'qs=1')

    var qs = () => ({options}) => (options.path += '?qs=2', {options})
    var c2 = c1.extend({Request: {qs}})
    var {body} = await c2.client({url: 'http://localhost:5000', qs: {}})
    t.equal(body, 'qs=2')

    var {body} = await c1.client({url: 'http://localhost:5000', qs: {}})
    t.equal(body, 'qs=1')
  })

  after((done) => server.close(done))

})
