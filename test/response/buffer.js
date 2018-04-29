
var t = require('assert')
var fs = require('fs')
var path = require('path')

var Response = {
  buffer: require('../../response/buffer'),
}

var file = {
  binary: path.resolve(__dirname, '../fixtures/cat.png'),
}


describe('buffer', () => {

  it('response', async () => {
    var {body} = await Response.buffer()({
      res: fs.createReadStream(file.binary, {highWaterMark: 1024}),
    })
    t.equal(
      fs.statSync(file.binary).size,
      body.length,
      'should return the raw buffer'
    )
  })

})
