
var compose = require('request-compose')
compose.Request.multipart = require('request-multipart')

;(async () => {
  var file = 'cat.png'
  var auth = {
    dropbox: '[ACCESS TOKEN]',
    slack: '[ACCESS TOKEN]',
  }
  try {
    var {body:meta} = await compose.client({
      method: 'POST',
      url: 'https://slack.com/api/files.upload',
      qs: {title: 'My Awesome Cat!'},
      headers: {authorization: `Bearer ${auth.slack}`},
      multipart: {
        file: (await compose.stream({
          url: 'https://content.dropboxapi.com/2/files/download',
          headers: {
            'authorization': `Bearer ${auth.dropbox}`,
            'Dropbox-API-Arg': JSON.stringify({path: `/${file}`}),
          }
        })).res
      }
    })
    console.log(meta)
  }
  catch (err) {
    console.error(err)
  }
})()
