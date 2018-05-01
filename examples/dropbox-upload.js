
var request = require('request-compose').client
var fs = require('fs')

;(async () => {
  var file = 'cat.png'
  var token = '[ACCESS TOKEN]'
  try {
    var {body:meta} = await request({
      method: 'POST',
      url: 'https://content.dropboxapi.com/2/files/upload',
      headers: {
        'authorization': `Bearer ${token}`,
        'content-type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({path: `/${file}`, mode: 'add'}),
      },
      body: fs.createReadStream(file),
    })
    console.log(meta)
  }
  catch (err) {
    console.error(err)
  }
})()
