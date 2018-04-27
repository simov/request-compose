
var t = require('assert')
var stream = require('stream')

var Response = {
  buffer: require('../../response/buffer')(),
}


describe('buffer', () => {

  it('utf8 encoding by default', async () => {
    var options = {}
    var res = new stream.Readable()
    res._read = (size) => {/*noop*/}

    setTimeout(() => {
      res.emit('data', Buffer.from('hey'))
      res.emit('end')
    }, 0)

    var {body} = await Response.buffer({options, res})
    t.equal(
      body,
      'hey',
      'should buffer the response body'
    )
  })

  it('set specific encoding', async () => {
    var options = {encoding: 'base64'}
    var res = new stream.Readable()
    res._read = (size) => {/*noop*/}

    setTimeout(() => {
      res.emit('data', Buffer.from('hey'))
      res.emit('end')
    }, 0)

    var {body} = await Response.buffer({options, res})
    t.equal(
      body,
      'aGV5',
      'should buffer the response body'
    )
  })

  it('binary data', async () => {
    var options = {encoding: null}
    var res = new stream.Readable()
    res._read = (size) => {/*noop*/}

    var input = Buffer.from('hey')
    setTimeout(() => {
      res.emit('data', input)
      res.emit('end')
    }, 0)

    var {body} = await Response.buffer({options, res})
    t.ok(
      input.equals(body),
      'should buffer the response body'
    )
  })

})
