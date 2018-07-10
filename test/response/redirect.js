
var t = require('assert')
var http = require('http')

var compose = require('../../')
compose.Request.oauth = require('request-oauth')
var request = compose.client


describe('redirect', () => {
  var server, server2, counter

  before((done) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      var [_, query] = req.url.split('?')

      if (/^\/no-location/.test(req.url)) {
        res.writeHead(301)
        res.end(query || 'not ok')
      }
      else if (/^\/absolute/.test(req.url)) {
        res.writeHead(301, {location: 'http://localhost:5000/target'})
        res.end(query || 'not ok')
      }
      else if (/^\/relative/.test(req.url)) {
        res.writeHead(301, {location: '/target'})
        res.end(query || 'not ok')
      }
      else if (/^\/target/.test(req.url)) {
        res.writeHead(200,
          query ? {'content-type': 'application/x-www-form-urlencoded'} : {}
        )
        res.end(query || 'ok')
      }
      else if (req.url === '/stuck') {
        res.writeHead(301, {location: 'http://localhost:5000/stuck'})
        res.end((++counter).toString())
      }
      else if (req.url === '/external') {
        res.writeHead(301, {location: 'http://127.0.0.1:5001/external'})
        res.end('ok')
      }
    })

    server2 = http.createServer()
    server2.on('request', (req, res) => {
      if (req.url === '/external') {
        res.writeHead(200)
        res.end(req.headers.authorization)
      }
    })

    server.listen(5000, () => {
      server2.listen(5001, done)
    })
  })

  it('missing location header', async () => {
    var {res, body} = await request({
      url: 'http://localhost:5000/no-location'
    })
    t.strictEqual(res.statusCode, 301)
    t.equal(res.statusMessage, 'Moved Permanently')
    t.equal(body, 'not ok')
  })

  it('do not follow patch|put|post|delete redirects', async () => {
    var {res, body} = await request({
      method: 'POST',
      url: 'http://localhost:5000/absolute'
    })
    t.strictEqual(res.statusCode, 301)
    t.equal(res.statusMessage, 'Moved Permanently')
    t.equal(body, 'not ok')
  })

  it('follow all redirects', async () => {
    var {res, body} = await request({
      method: 'POST',
      url: 'http://localhost:5000/absolute',
      redirect: {all: true}
    })
    t.strictEqual(res.statusCode, 200)
    t.equal(res.statusMessage, 'OK')
    t.equal(body, 'ok')
    t.equal(res.req.method, 'POST')
  })

  it('absolute URL', async () => {
    var {body} = await request({
      url: 'http://localhost:5000/absolute'
    })
    t.equal(body, 'ok', 'should follow absolute URLs')
  })

  it('relative URL', async () => {
    var {body} = await request({
      url: 'http://localhost:5000/relative'
    })
    t.equal(body, 'ok', 'should follow relative URLs')
  })

  it('stuck in redirect loop', async () => {
    counter = -1
    var args = {
      url: 'http://localhost:5000/stuck'
    }
    try {
      await request(args)
    }
    catch (err) {
      t.equal(
        err.message,
        'request-compose: exceeded maximum redirects',
        'throw error on maximum redirects exceeded'
      )
      t.equal(
        err.body,
        '3',
        'by default maximum of 3 redirects are allowed'
      )
      t.deepEqual(
        args,
        {url: 'http://localhost:5000/stuck'},
        'input args should not be modified'
      )
    }
  })

  it('set max redirects to follow', async () => {
    counter = -1
    var args = {
      url: 'http://localhost:5000/stuck',
      redirect: {max: 5}
    }
    try {
      await request(args)
    }
    catch (err) {
      t.equal(
        err.message,
        'request-compose: exceeded maximum redirects',
        'throw error on maximum redirects exceeded'
      )
      t.equal(
        err.body,
        '5',
        'by default maximum of 3 redirects are allowed'
      )
      t.deepEqual(
        args,
        {url: 'http://localhost:5000/stuck', redirect: {max: 5}},
        'input args should not be modified'
      )
    }
  })

  it('keep auth option when changing hostnames', async () => {
    var args = {
      url: 'http://localhost:5000/external',
      auth: {user: 'user', pass: 'pass'}
    }
    var {body} = await request(args)
    t.ok(
      /^Basic/.test(body),
      'should have authorization header'
    )
    t.deepEqual(
      args,
      {url: 'http://localhost:5000/external', auth: {user: 'user', pass: 'pass'}},
      'input args should not be modified'
    )
  })

  it('keep oauth option when changing hostnames', async () => {
    var args = {
      url: 'http://localhost:5000/external',
      oauth: {
        consumer_key: 'consumer_key',
        consumer_secret: 'consumer_secret',
        token: 'token',
        token_secret: 'token_secret'
      }
    }
    var {body} = await request(args)
    t.ok(
      /^OAuth/.test(body),
      'should have authorization header'
    )
    t.deepEqual(
      args,
      {
        url: 'http://localhost:5000/external',
        oauth: {
          consumer_key: 'consumer_key',
          consumer_secret: 'consumer_secret',
          token: 'token',
          token_secret: 'token_secret'
        }
      },
      'input args should not be modified'
    )
  })

  it('keep authorization header when changing hostnames', async () => {
    var args = {
      url: 'http://localhost:5000/external',
      headers: {authorization: 'Bearer fo'}
    }
    var {body} = await request(args)
    t.ok(
      /^Bearer/.test(body),
      'should have authorization header'
    )
    t.deepEqual(
      args,
      {url: 'http://localhost:5000/external', headers: {authorization: 'Bearer fo'}},
      'input args should not be modified'
    )
  })

  it('remove auth options when changing hostnames', async () => {
    var args = {
      url: 'http://localhost:5000/external',
      auth: {user: 'user', pass: 'pass'},
      redirect: {auth: false}
    }
    var {body} = await request(args)
    t.equal(
      body,
      '',
      'authorization header should be removed'
    )
    t.deepEqual(
      args,
      {
        url: 'http://localhost:5000/external',
        auth: {user: 'user', pass: 'pass'},
        redirect: {auth: false}
      },
      'input args should not be modified'
    )
  })

  it('remove oauth option when changing hostnames', async () => {
    var args = {
      url: 'http://localhost:5000/external',
      oauth: {
        consumer_key: 'consumer_key',
        consumer_secret: 'consumer_secret',
        token: 'token',
        token_secret: 'token_secret'
      },
      redirect: {auth: false}
    }
    var {body} = await request(args)
    t.equal(
      body,
      '',
      'authorization header should be removed'
    )
    t.deepEqual(
      args,
      {
        url: 'http://localhost:5000/external',
        oauth: {
          consumer_key: 'consumer_key',
          consumer_secret: 'consumer_secret',
          token: 'token',
          token_secret: 'token_secret'
        },
        redirect: {auth: false}
      },
      'input args should not be modified'
    )
  })

  it('remove authorization header when changing hostnames', async () => {
    var args = {
      url: 'http://localhost:5000/external',
      headers: {authorization: 'Bearer fo'},
      redirect: {auth: false}
    }
    var {body} = await request(args)
    t.equal(
      body,
      '',
      'authorization header should be removed'
    )
    t.deepEqual(
      args,
      {
        url: 'http://localhost:5000/external',
        headers: {authorization: 'Bearer fo'},
        redirect: {auth: false}
      },
      'input args should not be modified'
    )
  })

  it('switch to safe method', async () => {
    var {res, body} = await request({
      method: 'POST',
      url: 'http://localhost:5000/absolute',
      redirect: {all: true, method: false},
    })
    t.strictEqual(res.statusCode, 200)
    t.equal(res.statusMessage, 'OK')
    t.equal(body, 'ok')
    t.equal(res.req.method, 'GET')
  })

  it('referer', async () => {
    var {res, body} = await request({
      url: 'http://localhost:5000/absolute',
      redirect: {referer: true}
    })
    t.strictEqual(res.statusCode, 200)
    t.equal(res.statusMessage, 'OK')
    t.equal(body, 'ok')
    t.equal(res.req.getHeader('referer'), 'http://localhost:5000/absolute')
  })

  after((done) => {
    server.close(() => {
      server2.close(done)
    })
  })

})
