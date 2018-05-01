
var compose = require('request-compose')
compose.Request.oauth = require('request-oauth')
compose.Request.multipart = require('request-multipart')

var fs = require('fs')

;(async () => {
  var file = 'cat.png'
  try {
    var {body:meta} = await compose.client({
      method: 'POST',
      url: 'https://api.twitter.com/1.1/statuses/update_with_media.json',
      oauth: {
        consumer_key: '[APP ID]',
        consumer_secret: '[APP SECRET]',
        token: '[ACCESS TOKEN]',
        token_secret: '[ACCESS SECRET]',
      },
      multipart: {
        status: 'My Awesome Cat!',
        'media[]': fs.readFileSync(file),
      }
    })
    console.log(meta)
  }
  catch (err) {
    console.error(err)
  }
})()
