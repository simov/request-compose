
var t = require('assert')
var fs = require('fs')
var path = require('path')
var http = require('http')
var https = require('https')

var credentials = {
  key: fs.readFileSync(path.resolve(__dirname, '../ssl/private.pem'), 'utf8'),
  cert: fs.readFileSync(path.resolve(__dirname, '../ssl/public.pem'), 'utf8'),
}

var Request = {
  send: require('../../request/send')(),
}


describe('send', () => {
  var httpServer, httpsServer

  before(async () => {
    await new Promise((resolve) => {
      httpServer = http.createServer()
      httpServer.on('request', (req, res) => {
        res.writeHead(200, 'HTTP')
        if (req.method === 'POST') {
          var body = ''
          req.on('data', (chunk) => body += chunk)
          req.on('end', () => {
            t.equal(body, 'hey')
            res.end()
          })
        }
        else {
          res.end()
        }
      })
      httpServer.listen(5001, resolve)
    })
    await new Promise((resolve) => {
      httpsServer = https.createServer(credentials)
      httpsServer.on('request', (req, res) => {
        if (req.url === '/') {
          res.writeHead(200, 'HTTPS')
          res.end()
        }
        else if (req.url === '/error') {
          req.destroy()
        }
        else if (req.url === '/timeout') {
          setTimeout(() => {}, 150)
        }
      })
      httpsServer.listen(5002, resolve)
    })
  })

  it('http', async () => {
    var {res} = await Request.send({
      options: {
        protocol: 'http:',
        port: 5001,
        timeout: 5000,
      }
    })
    t.equal(res.statusCode, 200)
    t.equal(res.statusMessage, 'HTTP')
  })

  it('https', async () => {
    var {res} = await Request.send({
      options: {
        protocol: 'https:',
        port: 5002,
        timeout: 5000,
        rejectUnauthorized: false,
      }
    })
    t.equal(res.statusCode, 200)
    t.equal(res.statusMessage, 'HTTPS')
  })

  it('send body', async () => {
    var {res} = await Request.send({
      options: {
        method: 'POST',
        protocol: 'http:',
        port: 5001,
        timeout: 5000,
      },
      body: 'hey'
    })
  })

  it('error', async () => {
    try {
      var {res} = await Request.send({
        options: {
          protocol: 'https:',
          port: 5002,
          path: '/error',
          timeout: 5000,
          rejectUnauthorized: false,
        }
      })
    }
    catch (err) {
      t.equal(
        err.message,
        'socket hang up',
        'should throw error'
      )
    }
  })

  it('abort request on idle connection', async () => {
    try {
      var {res} = await Request.send({
        options: {
          protocol: 'https:',
          port: 5002,
          path: '/timeout',
          timeout: 100,
          rejectUnauthorized: false,
        }
      })
    }
    catch (err) {
      t.equal(err.code, 'ETIMEDOUT')
      t.equal(
        err.message,
        'request-compose: timeout',
        'should throw error'
      )
    }
  })

  describe('proxy from environment', () => {
    var proxyServer

    before(async () => {
      await new Promise((resolve) => {
        proxyServer = http.createServer(credentials)
        proxyServer.on('request', (req, res) => {
          t.ok(/https?:\/\/request:8080\//.test(req.url), 'should be absolute URL')
          res.writeHead(200, 'PROXY')
          res.end()
        })
        proxyServer.listen(5003, resolve)
      })
    })

    it('http_proxy', async () => {
      process.env.http_proxy = 'http://localhost:5003'
      try {
        var {res} = await Request.send({
          options: {
            protocol: 'http:',
            hostname: 'request',
            port: 8080,
            method: 'GET',
            path: '/',
            headers: {},
            timeout: 5000
          }
        })
        t.equal(res.statusCode, 200)
        t.equal(res.statusMessage, 'PROXY')
      } finally {
        delete process.env.http_proxy
      }
    })

    it('HTTP_PROXY', async () => {
      process.env.HTTP_PROXY = 'http://localhost:5003'
      try {
        var {res} = await Request.send({
          options: {
            protocol: 'http:',
            hostname: 'request',
            port: 8080,
            method: 'GET',
            path: '/',
            headers: {},
            timeout: 5000
          }
        })
        t.equal(res.statusCode, 200)
        t.equal(res.statusMessage, 'PROXY')
      } finally {
        delete process.env.HTTP_PROXY
      }
    })

    it('https_proxy', async () => {
      process.env.https_proxy = 'http://localhost:5003'
      try {
        var {res} = await Request.send({
          options: {
            protocol: 'https:',
            hostname: 'request',
            port: 8080,
            method: 'GET',
            path: '/',
            headers: {},
            timeout: 5000
          }
        })
        t.equal(res.statusCode, 200)
        t.equal(res.statusMessage, 'PROXY')
      } finally {
        delete process.env.https_proxy
      }
    })

    it('HTTPS_PROXY', async () => {
      process.env.HTTPS_PROXY = 'http://localhost:5003'
      try {
        var {res} = await Request.send({
          options: {
            protocol: 'https:',
            hostname: 'request',
            port: 8080,
            method: 'GET',
            path: '/',
            headers: {},
            timeout: 5000
          }
        })
        t.equal(res.statusCode, 200)
        t.equal(res.statusMessage, 'PROXY')
      } finally {
        delete process.env.HTTPS_PROXY
      }
    })

    after((done) => proxyServer.close(done))

  })

  after((done) => httpServer.close(() => httpsServer.close(done)))

})
