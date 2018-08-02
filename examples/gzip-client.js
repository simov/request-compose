
var request = require('../').client

;(async () => {
  try {
    var {res, body} = await request({
      url: 'https://api.github.com/users/simov',
      headers: {
        'user-agent': 'request-compose',
        'accept-encoding': 'gzip, deflate',
      }
    })
    console.log(res.statusCode, res.statusMessage)
    console.log(res.headers['content-encoding'])
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
