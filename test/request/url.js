
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

  it('append querystring to path', () => {
    t.deepStrictEqual(
      Request.url(url.parse('https://my.io/p?a=1&b=2'))({options: {}}).options,
      {
        protocol: 'https:',
        hostname: 'my.io',
        port: null,
        path: '/p?a=1&b=2'
      },
      'should set http.request options'
    )
  })

})
