
var log = require('../utils/log')


module.exports = (encoding) => ({options, res}) => new Promise((resolve, reject) => {
  var body = []
  res
    .on('data', (chunk) => body.push(chunk))
    .on('end', () => {
      body = Buffer.concat(body)
      if (encoding !== null) {
        body = Buffer.from(body).toString(encoding)
      }
      log({body})
      resolve({options, res, body})
    })
    .on('error', reject)
})
