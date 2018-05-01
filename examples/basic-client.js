
var request = require('request-compose').client

;(async () => {
  try {
    var {res, body} = await request({
      url: 'https://api.github.com/users/simov',
      headers: {
        'user-agent': 'request-compose'
      }
    })
    console.log(res.statusCode, res.statusMessage)
    console.log(res.headers['x-ratelimit-remaining'])
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
