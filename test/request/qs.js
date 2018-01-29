
var t = require('assert')

var Request = {
  qs: require('../../request/qs'),
}


describe('qs', () => {

  it('string', () => {
    t.equal(
      Request.qs('a=1&b=2')({options: {path: '/'}}).options.path,
      '/?a=1&b=2',
      'qs string should be appended to the default path'
    )
  })

  it('object', () => {
    t.equal(
      Request.qs({a: 1, b: 2})({options: {path: '/'}}).options.path,
      '/?a=1&b=2',
      'qs object should be appended to the default path'
    )
  })

  it('rfc3986', () => {
    t.equal(
      Request.qs({rfc3986: '!*()\''})({options: {path: '/'}}).options.path,
      '/?rfc3986=%21%2A%28%29%27',
      'qs rfc3986 should be escaped'
    )
  })

  it('override and extend path querystring', () => {
    t.equal(
      Request.qs({a: 2, b: 2})({options: {path: '/?a=1&c=3'}}).options.path,
      '/?a=2&c=3&b=2',
      'qs object should override and extend querystring embedded into the path'
    )
  })

})
