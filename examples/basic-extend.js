
var compose = require('../')
var Request = compose.Request
var Response = compose.Response

var request = (options) => compose(
  Request.defaults(),
  ({options}) => {
    options.headers['user-agent'] = 'request-compose'
    options.headers['accept'] = 'application/vnd.github.v3+json'
    return {options}
  },
  Request.url(`https://api.github.com/${options.url}`),
  Request.send(),
  Response.buffer(),
  Response.string(),
  Response.parse(),
)(options)

;(async () => {
  try {
    var {res, body} = await request({url: 'users/simov'})
    console.log(res.statusCode, res.statusMessage)
    console.log(res.headers['x-ratelimit-remaining'])
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
