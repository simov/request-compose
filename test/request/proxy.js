
var t = require('assert')
var url = require('url')

var Request = {
  proxy: require('../../request/proxy'),
}


describe('proxy', () => {

  it('protocol, hostname and path', () => {
    var options = Request.proxy('https://proxy.com')
      ({options: Object.assign(url.parse('http://resource.com'))}).options

    t.equal(options.protocol, 'https:')
    t.equal(options.hostname, 'proxy.com')
    t.equal(options.path, 'http://resource.com/')
  })

  it('port', () => {
    var options = Request.proxy('https://proxy.com:3000')
      ({options: Object.assign(url.parse('http://resource.com:4000'))}).options

    t.equal(options.protocol, 'https:')
    t.equal(options.hostname, 'proxy.com')
    t.equal(options.port, 3000)
    t.equal(options.path, 'http://resource.com:4000/')
  })

})
