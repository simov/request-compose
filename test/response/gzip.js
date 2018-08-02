
var t = require('assert')
var zlib = require('zlib')

var Response = {
  gzip: require('../../response/gzip'),
}


describe('gzip', () => {

  it('gzip', async () => {
    var {body} = await Response.gzip()({
      res: {
        headers: {'content-encoding': 'gzip'},
      },
      body: zlib.gzipSync('hey'),
    })
    t.equal(
      body,
      'hey',
      'should decompress gzip body'
    )
  })

  it('deflate', async () => {
    var {body} = await Response.gzip()({
      res: {
        headers: {'content-encoding': 'deflate'},
      },
      body: zlib.deflateSync('hey'),
    })
    t.equal(
      body,
      'hey',
      'should decompress deflate body'
    )
  })

  it('error', async () => {
    try {
      await Response.gzip()({
        res: {
          headers: {'content-encoding': 'gzip'},
        },
        body: zlib.deflateSync('hey'),
      })
    }
    catch (err) {
      t.equal(
        err.message,
        'incorrect header check',
        'should catch zlib errors'
      )
    }
  })

})
