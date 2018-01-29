
var compose = (...fns) => (args) =>
  fns.reduce((p, f) => p.then(f), Promise.resolve(args))


var load = (type, middlewares) => middlewares
  .reduce((obj, mw) => (obj[mw] = require(`./${type}/${mw}`), obj), {})


var Request = load('request', [
  'defaults',
  'url',
  'qs',
  'form',
  'json',
  'length',
  'send',
])


var Response = load('response', [
  'buffer',
  'parse',
])


var client = (args) => compose(

  Request.defaults(args),

  (() =>
    args.url ? Request.url(args.url) : ({options}) => ({options})
  )(),

  (() =>
    args.form ? Request.form(args.form) :
    args.json ? Request.json(args.json) :
    args.body ? Request.body(args.body) :
    ({options}) => ({options})
  )(),
  (() => ({options, body}) =>
    body ? Request.length()({options, body}) : {options}
  )(),

  Request.send(),

  Response.buffer(),
  Response.parse(),

)()


compose.client = client
compose.Request = Request
compose.Response = Response
module.exports = compose
