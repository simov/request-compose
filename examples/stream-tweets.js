
var compose = require('../')
compose.Request.oauth = require('request-oauth')
var request = compose.stream // !
var json = require('JSONStream')

;(async () => {
  try {
    var {res} = await request({
      url: 'https://stream.twitter.com/1.1/statuses/filter.json',
      qs: {
        track: 'twitter',
      },
      oauth: {
        consumer_key: '[APP ID]',
        consumer_secret: '[APP SECRET]',
        token: '[ACCESS TOKEN]',
        token_secret: '[ACCESS SECRET]',
      }
    })
    res.pipe(json.parse()).on('data', (data) => {
      if (data.user) {
        console.log(data.user.id, data.user.name, data.user.screen_name)
        console.log(data.id, data.text)
        console.log('----------------')
      }
    })
  }
  catch (err) {
    console.error(err)
  }
})()
