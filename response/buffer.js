
var log = require('../utils/log')


module.exports = () => ({options, res}) => new Promise((resolve, reject) => {
  var body = ''
  res
    .on('data', (chunk) => body += chunk)
    .on('end', () => {
      log({body})
      resolve({options, res, body})
    })
    .on('error', reject)
})
