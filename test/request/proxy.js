
var t = require('assert')
var url = require('url')

var Request = {
  proxy: require('../../request/proxy'),
}


describe('proxy', () => {

  it('protocol, hostname and path', () => {
    var {protocol, hostname, port, path} = url.parse('http://resource.com')
    var {options} = Request.proxy('https://proxy.com')
      ({options: {protocol, hostname, port, path, headers: {}}})

    t.deepEqual(options, {
      protocol: 'https:',
      hostname: 'proxy.com',
      port: null,
      path: 'http://resource.com/',
      headers: {host: 'resource.com'}
    })
  })

  it('port', () => {
    var {protocol, hostname, port, path} = url.parse('http://resource.com:4000')
    var {options} = Request.proxy('https://proxy.com:3000')
      ({options: {protocol, hostname, port, path, headers: {}}})

    t.deepEqual(options, {
      protocol: 'https:',
      hostname: 'proxy.com',
      port: '3000',
      path: 'http://resource.com:4000/',
      headers: {host: 'resource.com'}
    })
  })

  it('as object', () => {
    var {protocol, hostname, port, path} = url.parse('http://resource.com')
    var {options} = Request.proxy({ protocol: 'https:', hostname: 'proxy.com' })
      ({options: {protocol, hostname, port, path, headers: {}}})

    t.deepEqual(options, {
      protocol: 'https:',
      hostname: 'proxy.com',
      port: null,
      path: 'http://resource.com/',
      headers: {host: 'resource.com'}
    })
  })

})
