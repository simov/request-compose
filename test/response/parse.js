
var t = require('assert')
var querystring = require('querystring')

var Response = {
  parse: require('../../response/parse')(),
}


describe('parse', () => {

  it('non matching content-type header', () => {
    t.deepStrictEqual(
      Response.parse({
        res: {headers: {}},
        body: 'hey',
      }),
      {
        options: undefined,
        res: {headers: {}},
        body: 'hey',
        raw: 'hey',
      },
      'should return the input body as it is'
    )
  })

  it('parse JSON - application/json', () => {
    t.deepStrictEqual(
      Response.parse({
        res: {headers: {'content-type': 'application/json'}},
        body: JSON.stringify({a: 1, b: 2}),
      }),
      {
        options: undefined,
        res: {headers: {'content-type': 'application/json'}},
        body: {a: 1, b: 2},
        raw: '{"a":1,"b":2}',
      },
      'should parse application/json response'
    )
  })

  it('parse JSON - application/javascript', () => {
    t.deepStrictEqual(
      Response.parse({
        res: {headers: {'content-type': 'application/javascript'}},
        body: JSON.stringify({a: 1, b: 2}),
      }),
      {
        options: undefined,
        res: {headers: {'content-type': 'application/javascript'}},
        body: {a: 1, b: 2},
        raw: '{"a":1,"b":2}',
      },
      'should parse application/javascript response'
    )
  })

  it('parse JSON - error', () => {
    t.deepStrictEqual(
      Response.parse({
        res: {headers: {'content-type': 'application/json'}},
        body: 'hey',
      }),
      {
        options: undefined,
        res: {headers: {'content-type': 'application/json'}},
        body: 'hey',
        raw: 'hey',
      },
      'should return the input body as it is'
    )
  })

  it('parse form - application/x-www-form-urlencoded', () => {
    t.deepEqual(
      Response.parse({
        res: {headers: {'content-type': 'application/x-www-form-urlencoded'}},
        body: querystring.stringify({a: 1, b: 2}),
      }),
      {
        options: undefined,
        res: {headers: {'content-type': 'application/x-www-form-urlencoded'}},
        body: {a: 1, b: 2},
        raw: 'a=1&b=2',
      },
      'should parse application/x-www-form-urlencoded response'
    )
  })

})
