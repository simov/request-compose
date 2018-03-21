
var t = require('assert')

var Response = {
  status: require('../../response/status')(),
}


describe('status', () => {

  it('200 range', () => {
    t.deepStrictEqual(
      Response.status({
        options: {},
        res: {statusCode: 200},
        body: 'hey',
        raw: 'hey',
      }),
      {
        options: {},
        res: {statusCode: 200},
        body: 'hey',
        raw: 'hey'
      },
      'should return the input arguments'
    )
  })

  it('300 range', () => {
    t.deepStrictEqual(
      Response.status({
        options: {},
        res: {statusCode: 301},
        body: 'hey',
        raw: 'hey',
      }),
      {
        options: {},
        res: {statusCode: 301},
        body: 'hey',
        raw: 'hey'
      },
      'should return the input arguments'
    )
  })

  it('400 range', () => {
    try {
      Response.status({
        res: {statusCode: 404, statusMessage: 'Not Found'},
        body: 'hey',
        raw: 'hey',
      })
    }
    catch (err) {
      t.equal(
        err.message,
        '404 Not Found',
        'throws an error containing the status code and the status message'
      )
    }
  })

  it('500 range', () => {
    try {
      Response.status({
        res: {statusCode: 500, statusMessage: 'Internal Server Error'},
        body: 'hey',
        raw: 'hey',
      })
    }
    catch (err) {
      t.equal(
        err.message,
        '500 Internal Server Error',
        'throws an error containing the status code and the status message'
      )
    }
  })

  it('error properties', () => {
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
