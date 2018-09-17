
var request = require('../').extend({
  Request: {cookie: require('request-cookie').Request},
  Response: {cookie: require('request-cookie').Response},
}).client

;(async () => {
  try {
    var cookie = {}
    var {res, body} = await request({
      method: 'POST',
      url: 'https://alpha.wallhaven.cc/auth/login',
      form: {
        username: '[USER]',
        password: '[PASS]',
      },
      cookie,
    })
    var {body:html} = await request({
      url: 'https://alpha.wallhaven.cc/settings/account',
      cookie,
    })
    var [_, email] = /type="email" value="([^"]+)"/.exec(html)
    console.log(email)
  }
  catch (err) {
    console.error(err)
  }
})()
