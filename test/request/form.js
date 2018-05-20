
var t = require('assert')
var querystring = require('querystring')
var qs = require('qs')

var Request = {
  form: require('../../request/form'),
}


describe('form', () => {

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

  it('string', () => {
    t.equal(
      Request.form('a=!(1)&b=2+3')({options: {headers: {}}}).body,
      'a=!(1)&b=2+3',
      'do not encode'
    )
  })

  it('object', () => {
    t.equal(
      Request.form({a: '!(1)', b: '2+3'})({options: {headers: {}}}).body,
      'a=%21%281%29&b=2%2B3',
      'encode reserved characters'
    )
    t.deepEqual(
      querystring.parse(
        Request.form({a: '!(1)', b: '2+3'})({options: {headers: {}}}).body
      ),
      {a: '!(1)', b: '2+3'},
      'decode reserved characters'
    )
  })

  it('filter out undefined keys', () => {
    t.equal(
      Request.form({a: 1, b: undefined, c: 3})({options: {headers: {}}}).body,
      'a=1&c=3',
      'exclude undefined keys from form object'
    )
  })

  it('encodeURIComponent + RFC3986', () => {
    var reserved = '!_*_\'_(_)_;_:_@_&_=_+_$_,_/_?_#_[_]'
    t.equal(
      Request.form({reserved})({options: {headers: {}}}).body,
      'reserved=%21_%2A_%27_%28_%29_%3B_%3A_%40_%26_%3D_%2B_%24_%2C_%2F_%3F_%23_%5B_%5D',
      'reserved characters should be escaped'
    )
    t.equal(
      Request.form({reserved})({options: {headers: {}}}).body,
      qs.stringify({reserved}),
      'querystring.stringify + RFC3986 should be identical to qs.stringify'
    )
  })

})
