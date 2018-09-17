
var request = require('../').extend({
  Request: {
    oauth: require('request-oauth'),
    multipart: require('request-multipart'),
  }
}).client

var fs = require('fs')

;(async () => {
  var file = 'cat.png'
  try {
    var {body:meta} = await request({
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
