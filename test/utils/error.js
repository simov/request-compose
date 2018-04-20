
var t = require('assert')
var request = require('../../').client
var error = require('../../utils/error')


describe('error', () => {

  it('node http', async () => {
    try {
      var {body} = await request({
        url: 'compose:5000'
      })
    }
    catch (err) {
      t.ok(
        /^Protocol "compose:" not supported\. Expected "http:"/
          .test(err.message),
        'should throw error from the underlying node core http module'
      )
    }
  })

  it('error module', () => {
    var res = {statusCode: 500, statusMessage: 'Server Error'}
    var body = {error: 'message'}
    var raw = JSON.stringify(body)
    t.deepEqual(
      error({res, body, raw}),
      {
        message: '500 Server Error',
        res: {statusCode: 500, statusMessage: 'Server Error'},
        body: {error: 'message'},
        raw: '{"error":"message"}'
      },
      'request properties should be set'
    )
  })

  it('error module - without raw parameter', () => {
    var res = {statusCode: 500, statusMessage: 'Server Error'}
    var body = 'not ok'
    t.deepEqual(
      error({res, body}),
      {
        message: '500 Server Error',
        res: {statusCode: 500, statusMessage: 'Server Error'},
        body: 'not ok',
        raw: 'not ok'
      },
      'raw should equal body'
    )
  })

})
