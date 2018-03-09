
var t = require('assert')

var Request = {
  form: require('../../request/form'),
}


describe('form', () => {

  it('string', () => {
    t.equal(
      Request.form('a=1&b=2')({options: {headers: {}}}).body,
      'a=1&b=2',
      'form string should be set as request body'
    )
  })

  it('object', () => {
    t.equal(
      Request.form({a: 1, b: 2})({options: {headers: {}}}).body,
      'a=1&b=2',
      'form object should be set as request body'
    )
  })

  it('filter out undefined keys', () => {
    t.equal(
      Request.form({a: 1, b: undefined})({options: {headers: {}}}).body,
      'a=1',
      'form object should exclude undefined keys'
    )
  })

  it('rfc3986', () => {
    t.equal(
      Request.form({rfc3986: '!*()\''})({options: {headers: {}}}).body,
      'rfc3986=%21%2A%28%29%27',
      'form rfc3986 should be escaped'
    )
  })

  it('set content-type header if missing', () => {
    t.equal(
      Request.form()({options: {headers: {}}}).options.headers['content-type'],
      'application/x-www-form-urlencoded',
      'content-type: application/x-www-form-urlencoded should be set'
    )
  })

  it('should not modify existing content-type header', () => {
    t.equal(
      Request.form()({options: {headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'}}})
        .options.headers['content-type'],
      'application/x-www-form-urlencoded; charset=UTF-8',
      'the content-type header should not be modified'
    )
  })

})
