
var t = require('assert')
var querystring = require('querystring')

var Response = {
  parse: require('../../response/parse')(),
}


describe('parse', () => {

  it('skip on missing content-type header', () => {
    t.deepStrictEqual(
      Response.parse({
        res: {headers: {}},
      }),
      {
        res: {headers: {}},
        body: undefined
      },
      'should return the input arguments'
    )
  })

  it('parse JSON', () => {
    t.deepStrictEqual(
      Response.parse({
        res: {headers: {'content-type': 'application/json'}},
        body: JSON.stringify({a: 1, b: 2}),
      }),
      {
        res: {headers: {'content-type': 'application/json'}},
        body: {a: 1, b: 2}
      },
      'should parse JSON response'
    )
  })

  it('parse form', () => {
    t.deepEqual(
      Response.parse({
        res: {headers: {'content-type': 'application/x-www-form-urlencoded'}},
        body: querystring.stringify({a: 1, b: 2}),
      }),
      {
        res: {headers: {'content-type': 'application/x-www-form-urlencoded'}},
        body: {a: 1, b: 2}
      },
      'should parse form encoded response'
    )
  })

})
