
var t = require('assert')
var http = require('http')
var url = require('url')

var request = require('../').client


describe('proxy request', () => {
  var proxy, resource

  before(async () => {
    await new Promise((resolve) => {
      proxy = http.createServer()
      proxy.on('request', async (req, res) => {
        var {res:_res} = await request({url: req.url})
        res.writeHead(_res.statusCode, {..._res.headers, 'x-proxy': true})
        res.end()
      })
      proxy.listen(5001, resolve)
    })
    await new Promise((resolve) => {
      resource = http.createServer()
      resource.on('request', (req, res) => {
        res.writeHead(200, {'x-resource': true})
        res.end()
      })
      resource.listen(5000, resolve)
    })
  })

  it('request', async () => {
    var {res:{headers}} = await request({
      url: 'http://localhost:5000',
      proxy: 'http://localhost:5001',
    })
    t.equal(headers['x-proxy'], 'true')
    t.equal(headers['x-resource'], 'true')
  })

  after((done) => proxy.close(() => resource.close(done)))

})

describe('proxy redirect', () => {
  var proxy, resource

  before(async () => {
    await new Promise((resolve) => {
      proxy = http.createServer()
      proxy.on('request', async (req, res) => {
        var r = http.request(url.parse(req.url))
        r.on('response', (_res) => {
          res.writeHead(_res.statusCode, {..._res.headers, 'x-proxy': true})
          res.end()
        })
        r.end()
      })
      proxy.listen(5001, resolve)
    })
    await new Promise((resolve) => {
      resource = http.createServer()
      resource.on('request', (req, res) => {
        if (req.url === '/resource') {
          res.writeHead(301, {
            location: 'http://localhost:5000/actual'
          })
        }
        else if (req.url === '/actual') {
          res.writeHead(200, {
            'x-actual': true
          })
        }
        res.end()
      })
      resource.listen(5000, resolve)
    })
  })

  it('redirect', async () => {
    var {res:{headers}} = await request({
      url: 'http://localhost:5000/resource',
      proxy: 'http://localhost:5001',
    })
    t.equal(headers['x-proxy'], 'true')
    t.equal(headers['x-actual'], 'true')
  })

  after((done) => proxy.close(() => resource.close(done)))

})
