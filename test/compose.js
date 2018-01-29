
var t = require('assert')
var http = require('http')

var compose = require('../')

var request = compose(
  (options) => {
    options.headers = options.headers || {}
    options.headers['user-agent'] = 'request-compose'
    return options
  },
  (options) => new Promise((resolve, reject) => {
    http.request(options)
      .on('response', resolve)
      .on('error', reject)
      .end()
  }),
  async (res) => await new Promise((resolve, reject) => {
    var body = ''
    res.on('data', (chunk) => body += chunk)
    res.on('end', () => resolve({res, body}))
    res.on('error', reject)
  }),
  ({res, body}) => ({res, body: JSON.parse(body)}),
)


describe('compose', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      t.equal(req.headers['user-agent'], 'request-compose')
      res.writeHead(200, 'OK', {
        'content-type': 'application/json'
      })
      res.end(JSON.stringify({a: 1}))
    })
    server.listen(5000, done)
  })

  it('request', async () => {
    var {res, body} = await request({
      port: 5000,
    })
    t.equal(res.statusCode, 200)
    t.equal(res.statusMessage, 'OK')
    t.deepStrictEqual(body, {a: 1})
  })

  after((done) => server.close(done))

})
