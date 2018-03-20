
var t = require('assert')
var stream = require('stream')

var Response = {
  status: require('../../response/status')({method: 'GET'}),
}


describe('status', () => {

  it('200 range', () => {
    t.deepStrictEqual(
      Response.status({
        res: {statusCode: 200},
        body: 'hey',
      }),
      {
        options: undefined,
        res: {statusCode: 200},
        body: 'hey',
        raw: 'hey'
      },
      'should return the input res, body and raw arguments'
    )
  })

  it('300 range', () => {
    try {
      Response.status({
        options: {path: ''},
        res: {statusCode: 301, statusMessage: 'Moved Permanently', headers: {
          location: '/path'
        }},
        body: 'hey',
        raw: 'hey',
      })
    }
    catch (err) {
      t.equal(
        err.message,
        'request-compose: redirect',
        'special error message should be set while redirecting'
      )
      t.equal(
        err.location,
        '/path',
        'location path should be set'
      )
    }
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
        'should throw an error containing the status code and the status message'
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
        'should throw an error containing the status code and the status message'
      )
    }
  })

  it('error properties + raw set implicitly', () => {
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
