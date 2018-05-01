
var compose = require('request-compose')
compose.Request.oauth = require('request-oauth')
var request = compose.client

;(async () => {
  try {
    var {body:user} = await request({
      url: 'https://api.twitter.com/1.1/users/show.json',
      qs: {
        screen_name: '[SCREEN NAME]'
      },
      oauth: {
        consumer_key: '[APP ID]',
        consumer_secret: '[APP SECRET]',
        token: '[ACCESS TOKEN]',
        token_secret: '[ACCESS SECRET]',
      }
    })
    console.log(user)
  }
  catch (err) {
    console.error(err)
  }
})()
