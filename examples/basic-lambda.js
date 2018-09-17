
var compose = require('../')
var https = require('https')

var request = compose(
  (options) => {
    options.headers = options.headers || {}
    options.headers['user-agent'] = 'request-compose'
    return options
  },
  (options) => new Promise((resolve, reject) => {
    https.request(options)
      .on('response', resolve)
      .on('error', reject)
      .end()
  }),
  async (res) => await new Promise((resolve, reject) => {
    var body = ''
    res
      .on('data', (chunk) => body += chunk)
      .on('end', () => resolve({res, body}))
      .on('error', reject)
  }),
  ({res, body}) => ({res, body: JSON.parse(body)}),
)

;(async () => {
  try {
    var {res, body} = await request({
      protocol: 'https:',
      hostname: 'api.github.com',
      path: '/users/simov',
    })
    console.log(res.statusCode, res.statusMessage)
    console.log(res.headers['x-ratelimit-remaining'])
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
