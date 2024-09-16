
var t = require('assert')
var http = require('http')

var Request = {
  auth: require('../../request/auth'),
}
var compose = require('../../')
var Request = compose.Request
var Response = compose.Response
var request = compose.client

describe('auth', () => {

  it('basic user:pass', () => {
    t.equal(
      Buffer.from(
        Request.auth({user: 'user', pass: 'pass'})({options: {headers: {}}})
          .options.headers.Authorization.replace('Basic ', '')
      , 'base64').toString(),
      'user:pass',
      'user and pass should be encoded as base64'
    )
  })

  it('basic user no pass', () => {
    t.equal(
      Buffer.from(
        Request.auth({user: 'user'})({options: {headers: {}}})
          .options.headers.Authorization.replace('Basic ', '')
      , 'base64').toString(),
      'user:',
      'user should be encoded as base64'
    )
  })

})

describe('auth', () => {
  var server

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.end(req.headers.authorization)
    })
    server.listen(5000, done)
  })

  it('object', async () => {
    var {body} = await request({
      url: 'http://localhost:5000',
      auth: {
        user: 'user',
        pass: 'pass',
      }
    })
    t.equal(
      Buffer.from(body.replace('Basic ', ''), 'base64').toString(),
      'user:pass',
      'user and pass should be encoded as base64'
    )
  })

  it('string', async () => {
    var {body} = await request({
      url: 'http://localhost:5000',
      auth: 'user:pass'
    })
    t.equal(
      Buffer.from(body.replace('Basic ', ''), 'base64').toString(),
      'user:pass',
      'user and pass should be encoded as base64'
    )
  })

  it('remove node http.auth object', async () => {
    var {body} = await compose(
      Request.defaults(),
      Request.url('http://localhost:5000'),
      ({options}) => Request.auth(options.auth)({options}),
      ({options}) => {
        t.equal(
          options.auth,
          undefined,
          'node http.auth object should be removed'
        )
        return {options}
      },
      Request.send(),
      Response.buffer(),
      Response.string(),
    )({auth: {user: 'user', pass: 'pass'}})
    t.equal(
      Buffer.from(body.replace('Basic ', ''), 'base64').toString(),
      'user:pass',
      'user and pass should be encoded as base64'
    )
  })

  after((done) => {
    server.close(done)
  })
})
