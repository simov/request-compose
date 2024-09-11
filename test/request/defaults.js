
var t = require('assert')

var Request = {
  defaults: require('../../request/defaults'),
}


describe('defaults', () => {

  it('defaults', () => {
    t.deepStrictEqual(
      Request.defaults()().options,
      {
        protocol: 'http:',
        hostname: 'localhost',
        port: 80,
        method: 'GET',
        path: '/',
        headers: {},
        timeout: 5000,
      },
      'http.request defaults + 5s timeout'
    )
  })

  it('override - input', () => {
    var args = {
      protocol: 'https:',
      hostname: 'website.com',
      port: 8080,
      method: 'POST',
      path: '/some/path?a=1&b=2',
      headers: {'content-type': 'application/json'},
      timeout: 3000,
    }
    t.deepStrictEqual(
      Request.defaults(args)().options,
      args,
      'should override http.request defaults'
    )
  })

  it('override - compose', () => {
    var args = {
      protocol: 'https:',
      hostname: 'website.com',
      port: 8080,
      method: 'POST',
      path: '/some/path?a=1&b=2',
      headers: {'content-type': 'application/json'},
      timeout: 3000,
    }
    t.deepStrictEqual(
      Request.defaults()(args).options,
      args,
      'should override http.request defaults'
    )
  })


  it('should not accept `auth`', () => {
    var args = {
      auth: { user: 'user', pass: 'pass' }
    }
    t.equal(
      Request.defaults(args)().options.auth,
      undefined,
      'should not include none string auth'
    )
  })

  it('filter out non http.request options', () => {
    t.equal(
      Request.defaults()().options.json,
      undefined,
      'non http.request options should be filtered out'
    )
  })

})
