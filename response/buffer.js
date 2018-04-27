
var log = require('../utils/log')


module.exports = () => ({options, res}) => new Promise((resolve, reject) => {
  var body = []
  res
    .on('data', (chunk) => body.push(chunk))
    .on('end', () => {
      body = Buffer.concat(body)
      if (options.encoding !== null) {
        body = Buffer.from(body).toString(options.encoding)
      }
      log({body})
      resolve({options, res, body})
    })
    .on('error', reject)
})
