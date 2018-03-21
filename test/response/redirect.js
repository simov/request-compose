
var t = require('assert')
var http = require('http')

var request = require('../../').client


describe('redirect', () => {
  var server

  before((done) => {
    var counter = 0
    server = http.createServer()
    server.on('request', (req, res) => {
      var [_, query] = req.url.split('?')

      if (/^\/absolute/.test(req.url)) {
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
    })
    server.listen(5000, done)
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

  it('absolute URL', async () => {
    var {body} = await request({
      url: 'http://localhost:5000/absolute'
    })
    t.equal(body, 'ok', 'should follow absolute URLs')
  })

  it('absolute URL + querystring', async () => {
    var {body} = await request({
      url: 'http://localhost:5000/absolute',
      qs: {a: 1}
    })
    t.deepEqual(body, {a: '1'}, 'should persist URL querystring')
  })

  it('relative URL', async () => {
    var {body} = await request({
      url: 'http://localhost:5000/relative'
    })
    t.equal(body, 'ok', 'should follow relative URLs')
  })

  it('relative URL + querystring', async () => {
    var {body} = await request({
      url: 'http://localhost:5000/relative',
      qs: {a: 1}
    })
    t.deepEqual(body, {a: '1'}, 'should persist URL querystring')
  })

  it('stuck in redirect loop', async () => {
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

  after((done) => {
    server.close(done)
  })

})
