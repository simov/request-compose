
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
      },
      'should return the input res and body'
    )
  })

  it('non 200 range', () => {
    t.throws(() =>
      Response.status({
        res: {statusCode: 404, statusMessage: 'Not Found'},
        body: 'hey',
      }),
      '404 Not Found hey',
      'should throw an error containing the status code, message and the body'
    )
  })

})
