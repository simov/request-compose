
var fs = require('fs')
var stream = require('stream')


module.exports = () => ({options, options: {headers}, body}) => new Promise((resolve) =>{

  var length = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-length')

  var encoding = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'transfer-encoding')

  if (headers[length] || headers[encoding] === 'chunked') {
    resolve({options, body})
    return
  }

  var getLength = (body, length, done) => {
    if (typeof body === 'string') {
      done(null, Buffer.byteLength(body))
    }
    else if (body instanceof Buffer) {
      done(null, body.length)
    }
    // request-multipart
    else if (body && body.constructor && body.constructor.name === 'BufferListStream') {
      done(null, body.length)
    }
    else if (body instanceof stream.Stream) {
      // fs.ReadStream
      if (body.hasOwnProperty('fd')) {
        fs.stat(body.path, (err, stats) => done(err, stats && stats.size))
      }
      // http.IncomingMessage
      else if (body.hasOwnProperty('httpVersion')) {
        done(!body.headers['content-length'], parseInt(body.headers['content-length']))
      }
      // request-multipart
      else if (body._items) {
        ;(function loop (index) {
          if (index === body._items.length) {
            done(null, length)
            return
          }
          var item = body._items[index]
          if (item._knownLength) {
            length += parseInt(item._knownLength)
            loop(++index)
          }
          else {
            getLength(item, length, (err, len) => {
              if (err) {
                done(err)
                return
              }
              length += len
              loop(++index)
            })
          }
        })(0)
      }
      else {
        done(true)
      }
    }
    else {
      done(true)
    }
  }

  getLength(body, 0, (err, length) => {
    err
      ? headers['transfer-encoding'] = 'chunked'
      : headers['content-length'] = length
    resolve({options, body})
  })
})
