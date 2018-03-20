
var log = require('../utils/log')


module.exports = () => ({res}) => new Promise((resolve, reject) => {
  var body = ''
  res
    .on('data', (chunk) => body += chunk)
    .on('end', () => {
      log({body})
      resolve({res, body})
    })
    .on('error', reject)
})
