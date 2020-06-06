
var t = require('assert')
var http = require('http')

var request = require('../../').client


describe('redirect', () => {
  var server, server2

  before((done) => {
    server = http.createServer()
    server2 = http.createServer()
    server.listen(5000, () => server2.listen(5001, done))
  })

  after((done) => server.close(() => server2.close(done)))

  it('missing location header', async () => {
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        res.writeHead(301)
        res.end()
      }
      else if ('/target' === req.url) {
        res.end('ok')
      }
    })
    var {res} = await request({
      url: 'http://localhost:5000/redirect'
    })
    t.strictEqual(res.statusCode, 301)
    t.equal(res.statusMessage, 'Moved Permanently')
    server.removeAllListeners('request')
  })

  it('input options should not be modified', async () => {
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        res.writeHead(301, {location: '/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        res.end('ok')
      }
    })
    var options = {
      url: 'http://localhost:5000/redirect',
    }
    var {body} = await request(options)
    t.equal(body, 'ok')
    t.deepEqual(
      options,
      {url: 'http://localhost:5000/redirect'},
      'input options should not be modified'
    )
    server.removeAllListeners('request')
  })

  it('do not follow patch|put|post|delete redirects', async () => {
    server.on('request', (req, res) => {
      t.equal(req.method, 'POST')
      if ('/redirect' === req.url) {
        res.writeHead(301, {location: 'http://localhost:5000/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        res.end('ok')
      }
    })
    var {res} = await request({
      method: 'POST',
      url: 'http://localhost:5000/redirect'
    })
    t.strictEqual(res.statusCode, 301)
    t.equal(res.statusMessage, 'Moved Permanently')
    server.removeAllListeners('request')
  })

  it('follow all redirects', async () => {
    server.on('request', (req, res) => {
      t.equal(req.method, 'POST')
      if ('/redirect' === req.url) {
        res.writeHead(301, {location: 'http://localhost:5000/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        res.end('ok')
      }
    })
    var {res, body} = await request({
      method: 'POST',
      url: 'http://localhost:5000/redirect',
      redirect: {all: true}
    })
    t.equal(body, 'ok', 'should follow all redirects')
    server.removeAllListeners('request')
  })

  it('absolute URL', async () => {
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        res.writeHead(301, {location: 'http://localhost:5000/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        res.end('ok')
      }
    })
    var {body} = await request({
      url: 'http://localhost:5000/redirect'
    })
    t.equal(body, 'ok', 'should follow absolute URLs')
    server.removeAllListeners('request')
  })

  it('relative root URL', async () => {
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        res.writeHead(301, {location: '/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        res.end('ok')
      }
    })
    var {body} = await request({
      url: 'http://localhost:5000/redirect'
    })
    t.equal(body, 'ok', 'should follow relative URLs')
    server.removeAllListeners('request')
  })

  it('do not append original request querystring', async () => {
    server.on('request', (req, res) => {
      if ('/redirect?a=1' === req.url) {
        res.writeHead(301, {location: '/target?b=2'})
        res.end()
      }
      else if ('/target?b=2' === req.url) {
        res.end('ok')
      }
    })
    var {body} = await request({
      url: 'http://localhost:5000/redirect',
      qs: {a: 1}
    })
    t.equal(body, 'ok')
    server.removeAllListeners('request')
  })

  it('stuck in redirect loop', async () => {
    var counter = -1
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        counter++
        res.writeHead(301, {location: '/redirect'})
        res.end()
      }
    })
    try {
      await request({
        url: 'http://localhost:5000/redirect'
      })
    }
    catch (err) {
      t.equal(counter, 3, 'by default maximum of 3 redirects are allowed')
      t.equal(
        err.message,
        'request-compose: exceeded maximum redirects',
        'throw error on maximum redirects exceeded'
      )
    }
    server.removeAllListeners('request')
  })

  it('set max redirects to follow', async () => {
    var counter = -1
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        counter++
        res.writeHead(301, {location: '/redirect'})
        res.end()
      }
    })
    try {
      await request({
        url: 'http://localhost:5000/redirect',
        redirect: {max: 5}
      })
    }
    catch (err) {
      t.equal(counter, 5, 'follow 5 redirects')
      t.equal(
        err.message,
        'request-compose: exceeded maximum redirects',
        'throw error on maximum redirects exceeded'
      )
    }
    server.removeAllListeners('request')
  })

  it('keep authorization header when changing hostnames', async () => {
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        res.writeHead(301, {location: 'http://127.0.0.1:5001/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        res.end('ok')
      }
    })
    server2.on('request', (req, res) => {
      if (req.url === '/target') {
        t.equal(
          req.headers.authorization,
          'Bearer simov',
          'should have authorization header'
        )
        res.end('ok')
      }
    })
    var {body} = await request({
      url: 'http://localhost:5000/redirect',
      headers: {authorization: 'Bearer simov'}
    })
    t.equal(body, 'ok')
    server.removeAllListeners('request')
    server2.removeAllListeners('request')
  })

  it('remove auth options when changing hostnames', async () => {
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        res.writeHead(301, {location: 'http://127.0.0.1:5001/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        res.end('ok')
      }
    })
    server2.on('request', (req, res) => {
      if (req.url === '/target') {
        t.equal(
          req.headers.authorization,
          undefined,
          'should not have authorization header'
        )
        res.end('ok')
      }
    })
    var {body} = await request({
      url: 'http://localhost:5000/redirect',
      headers: {authorization: 'Bearer simov'},
      redirect: {auth: false}
    })
    t.equal(body, 'ok')
    server.removeAllListeners('request')
    server2.removeAllListeners('request')
  })

  it('switch to safe method', async () => {
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        t.equal(req.method, 'POST')
        res.writeHead(301, {location: '/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        t.equal(req.method, 'GET')
        res.end('ok')
      }
    })
    var {body} = await request({
      method: 'POST',
      url: 'http://localhost:5000/redirect',
      redirect: {all: true, method: false},
    })
    t.equal(body, 'ok')
    server.removeAllListeners('request')
  })

  it('referer', async () => {
    server.on('request', (req, res) => {
      if ('/redirect' === req.url) {
        res.writeHead(301, {location: '/target'})
        res.end()
      }
      else if ('/target' === req.url) {
        t.equal(req.headers.referer, 'http://localhost:5000/redirect')
        res.end('ok')
      }
    })
    var {body} = await request({
      url: 'http://localhost:5000/redirect',
      redirect: {referer: true}
    })
    t.equal(body, 'ok')
    server.removeAllListeners('request')
  })

})
