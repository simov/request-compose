
var request = require('../').client
var iconv = require('iconv-lite')
var http = require('http')


;(async () => {
  var server

  await new Promise((resolve) => {
    server = http.createServer()
    server.on('request', (req, res) => {
      res.end(iconv.encode('你好', 'BIG5'))
    })
    server.listen(5000, resolve)
  })

  var {body} = await request({
    url: 'http://localhost:5000',
    encoding: null, // !
  })
  console.log(iconv.decode(body, 'BIG5'))

  server.close()
})()
