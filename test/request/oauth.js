
var t = require('assert')
var http = require('http')

var compose = require('../../')
compose.Request.oauth = require('request-oauth')
var request = compose.client


describe('oauth', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.end(req.headers.authorization)
    })
    server.listen(5000, done)
  })

  it('middleware', async () => {
    var {body} = await request({
      url: 'http://localhost:5000',
      oauth: {
        consumer_key: 'app_key',
        consumer_secret: 'app_secret',
        token: 'user_token',
        token_secret: 'user_secret',
      }
    })

    var header = body.replace('OAuth', '').trim().split(',')
      .map((kvp) => kvp.split('='))
      .reduce((all, [key, value]) => (
        all[key] = decodeURIComponent(value.replace(/"/g, '')),
        all
      ), {})

    t.equal(header.oauth_consumer_key, 'app_key')
    t.equal(header.oauth_token, 'user_token')
    t.equal(header.oauth_version, '1.0')
    t.equal(header.oauth_signature_method, 'HMAC-SHA1')

    t.equal(typeof header.oauth_nonce, 'string')
    t.equal(typeof header.oauth_timestamp, 'string')
    t.equal(typeof header.oauth_signature, 'string')
  })

  after((done) => {
    server.close(done)
  })

})
