
module.exports = () => ({options, res}) => new Promise((resolve, reject) => {
  var body = []
  res
    .on('data', (chunk) => body.push(chunk))
    .on('end', () => {
      body = Buffer.concat(body)
      resolve({options, res, body})
    })
    .on('error', reject)
})
