
var compose = require('../').extend({
  Request: {multipart: require('request-multipart')}
})

var download = ({token, file}) =>
  compose.stream({
    url: 'https://content.dropboxapi.com/2/files/download',
    headers: {
      'authorization': `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({path: `/${file}`}),
    }
  })

var upload = ({token, file, body}) =>
  compose.client({
    method: 'POST',
    url: 'https://www.googleapis.com/upload/drive/v2/files',
    qs: {uploadType: 'multipart'},
    headers: {authorization: `Bearer ${token}`},
    multipart: [
      {
        'Content-Type': 'application/json',
        body: JSON.stringify({title: file}),
      },
      {
        'Content-Type': 'image/png',
        body,
      }
    ]
  })

;(async () => {
  var auth = {
    dropbox: '[ACCESS TOKEN]',
    grive: '[ACCESS TOKEN]',
  }
  var file = 'cat.png'
  try {
    var {res:body} = await download({token: auth.dropbox, file})
    var {body:meta} = await upload({token: auth.gdrive, file, body})
    console.log(meta)
  }
  catch (err) {
    console.error(err)
  }
})()
