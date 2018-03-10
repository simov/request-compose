
var t = require('assert')
var stream = require('stream')

var Response = {
  status: require('../../response/status')(),
}


describe('status', () => {

  it('200 range', () => {
    t.deepStrictEqual(
      Response.status({
        res: {statusCode: 200},
        body: 'hey',
      }),
      {
        res: {statusCode: 200},
        body: 'hey',
        raw: 'hey'
      },
      'should return the input res and body'
    )
  })

  it('non 200 range - error message', () => {
    t.throws(() =>
      Response.status({
        res: {statusCode: 404, statusMessage: 'Not Found'},
        body: 'hey',
        raw: 'hey',
      }),
      '404 Not Found',
      'should throw an error containing the status code and the status message'
    )
  })

  it('non 200 range - error properties + raw set implicitly', () => {
    try {
      Response.status({
        res: {statusCode: 404, statusMessage: 'Not Found'},
        body: 'hey',
      })
    }
    catch (err) {
      t.equal(
        err.message,
        '404 Not Found',
        'should contain the status code and the status message'
      )
      t.deepStrictEqual(
        err.res,
        {statusCode: 404, statusMessage: 'Not Found'},
        'should contain the response object'
      )
      t.equal(
        err.body,
        'hey',
        'should contain the parsed response body'
      )
      t.equal(
        err.raw,
        'hey',
        'should contain the raw response body'
      )
    }
  })

})
