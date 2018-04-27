
var t = require('assert')

var Request = {
  length: require('../../request/length'),
}


describe('length', () => {

  it('set content-length for string body', () => {
    t.deepStrictEqual(
      Request.length()({options: {headers: {}}, body: 'λ'}).options.headers,
      {
        'content-length': 2
      },
      'content-length should equal 2'
    )
  })

  it('set content-length for Buffer body', () => {
    t.deepStrictEqual(
      Request.length()({options: {headers: {}}, body: Buffer.from('λ')}).options.headers,
      {
        'content-length': 2
      },
      'content-length should equal 2'
    )
  })

  it('don\'t set content-length if transfer-encoding: chunked is set', () => {
    t.deepStrictEqual(
      Request.length()({options: {
        headers: {'transfer-encoding': 'chunked'}},
        body: 'λ'
      }).options.headers,
      {
        'transfer-encoding': 'chunked'
      },
      'content-length should not be set'
    )
  })

  it('preserve existing content-length header', () => {
    t.deepStrictEqual(
      Request.length()({options: {
        headers: {'content-length': 1}},
        body: 'λ'
      }).options.headers,
      {
        'content-length': 1
      },
      'content-length should not be set'
    )
  })

})
