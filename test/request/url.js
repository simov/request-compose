
var t = require('assert')
var url = require('url')

var Request = {
  url: require('../../request/url'),
}


describe('url', () => {

  it('parse url string', () => {
    t.deepStrictEqual(
      Request.url('http://localhost:5000')({options: {}}).options,
      {
        protocol: 'http:',
        hostname: 'localhost',
        port: '5000',
        path: '/'
      },
      'should set http.request options'
    )
  })

  it('accept url object', () => {
    t.deepStrictEqual(
      Request.url(url.parse('http://localhost:5000'))({options: {}}).options,
      {
        protocol: 'http:',
        hostname: 'localhost',
        port: '5000',
        path: '/'
      },
      'should set http.request options'
    )
  })

  it('querystring', () => {
    t.deepStrictEqual(
      Request.url(url.parse('https://my.io/?a=!(1)&b=2+3#anchor'))({options: {}}).options,
      {
        protocol: 'https:',
        hostname: 'my.io',
        port: null,
        path: '/?a=!(1)&b=2+3'
      },
      'do not encode querystring'
    )
  })

})
