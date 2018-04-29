
var compose = require('../')
var iconv = require('iconv-lite')

var request = (options) => compose(
  _ => compose.buffer(options), // !
  ({res, body}) => ({res, body: iconv.decode(body, options.encoding)}),
)()

;(async () => {
  try {
    var {body} = await request({
      url: 'https://raw.githubusercontent.com/simov/markdown-viewer/master/test/encoding/windows-1251.md',
      encoding: 'windows-1251',
    })
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
