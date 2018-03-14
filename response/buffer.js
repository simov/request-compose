
module.exports = () => ({res}) => new Promise((resolve, reject) => {
  var body = ''
  res
    .on('data', (chunk) => body += chunk)
    .on('end', () => {
      // process.env.DEBUG && require('request-logs')({body})
      resolve({res, body})
    })
    .on('error', reject)
})
