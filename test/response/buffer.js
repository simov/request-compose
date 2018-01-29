
var t = require('assert')
var stream = require('stream')

var Response = {
  buffer: require('../../response/buffer')(),
}


describe('buffer', () => {

  it('buffer response body', async () => {
    var res = new stream.Readable()
    res._read = (size) => {/*noop*/}

    setTimeout(() => {
      res.emit('data', 'hey')
      res.emit('end')
    }, 0)

    var {body} = await Response.buffer({res})
    t.equal(
      body,
      'hey',
      'should buffer the response body'
    )
  })

})
