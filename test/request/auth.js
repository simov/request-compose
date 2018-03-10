
var t = require('assert')

var Request = {
  auth: require('../../request/auth'),
}


describe('auth', () => {

  it('basic user:pass', () => {
    t.equal(
      Buffer.from(
        Request.auth({user: 'user', pass: 'pass'})({options: {headers: {}}})
          .options.headers.Authorization.replace('Basic ', '')
      , 'base64').toString(),
      'user:pass',
      'user and pass should be encoded as base64'
    )
  })

  it('basic user no pass', () => {
    t.equal(
      Buffer.from(
        Request.auth({user: 'user'})({options: {headers: {}}})
          .options.headers.Authorization.replace('Basic ', '')
      , 'base64').toString(),
      'user:',
      'user should be encoded as base64'
    )
  })

})
