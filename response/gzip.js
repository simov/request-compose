
var zlib = require('zlib')

module.exports = () => ({options, res, body, raw}) => new Promise((resolve, reject) => {

  var header = Object.keys(res.headers)
    .find((name) => name.toLowerCase() === 'content-encoding')

  var decode =
    /gzip/i.test(res.headers[header]) ? 'gunzip' :
    /deflate/i.test(res.headers[header]) ? 'inflate' :
    false

  if (decode) {
    raw = body

    var opts = {
      flush: zlib.Z_SYNC_FLUSH,
      finishFlush: zlib.Z_SYNC_FLUSH,
    }

    zlib[decode](body, opts, (err, decoded) => {
      if (err) {
        reject(err)
        return
      }
      resolve({options, res, body: decoded, raw})
    })
  }
  else {
    resolve({options, res, body, raw})
  }

})
