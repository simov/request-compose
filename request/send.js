
var http = require('http')
var https = require('https')


module.exports = () => ({options, body}) => new Promise((resolve, reject) => {
  (/https/.test(options.protocol) ? https : http)
  .request(options)
    .on('response', (res) => resolve({res}))
    .on('error', reject)
    .end(body)
})
