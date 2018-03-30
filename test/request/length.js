
var t = require('assert')

var Request = {
  length: require('../../request/length'),
}


describe('length', () => {

  it('set content-length', () => {
    t.deepStrictEqual(
      Request.length()({options: {headers: {}}, body: 'λ'}).options.headers,
      {
        'content-length': 2
      },
      'content-length should equal 2'
    )
  })

  it('don\'t set content-length if transfer-encoding: chunked is set', () => {
    t.deepStrictEqual(
      Request.length()({options: {headers: {
        'transfer-encoding': 'chunked'}}, body: 'hey'}).options.headers,
      {
        'transfer-encoding': 'chunked'
      },
      'content-length should not be set'
    )
  })

})
