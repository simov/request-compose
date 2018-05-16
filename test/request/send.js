
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

  after((done) => httpServer.close(() => httpsServer.close(done)))

})
