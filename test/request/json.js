
var t = require('assert')

var Request = {
  json: require('../../request/json'),
}


describe('json', () => {

  it('string', () => {
    t.equal(
      Request.json('{"a":1,"b":2}')({options: {headers: {}}}).body,
      '{"a":1,"b":2}',
      'json string should be set as request body'
    )
  })

  it('object', () => {
    t.equal(
      Request.json({a: 1, b: 2})({options: {headers: {}}}).body,
      '{"a":1,"b":2}',
      'json object should be set as request body'
    )
  })

  it('set content-type header if missing', () => {
    t.equal(
      Request.json()({options: {headers: {}}}).options.headers['content-type'],
      'application/json',
      'content-type: application/json should be set'
    )
  })

  it('should not modify existing content-type header', () => {
    t.equal(
      Request.json()({options: {headers: {
        'content-type': 'application/json; charset=UTF-8'}}})
        .options.headers['content-type'],
      'application/json; charset=UTF-8',
      'the content-type header should not be modified'
    )
  })

})
