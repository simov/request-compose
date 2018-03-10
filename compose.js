
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
  'body',
  'auth',
  'length',
  'send',
])


var Response = load('response', [
  'buffer',
  'status',
  'parse',
])


var client = (args) => compose(

  Request.defaults(args),

  (() =>
    args.url ? Request.url(args.url) : ({options}) => ({options})
  )(),
  (() =>
    args.qs ? Request.qs(args.qs) : ({options}) => ({options})
  )(),

  (() =>
    args.form ? Request.form(args.form) :
    args.json ? Request.json(args.json) :
    args.body ? Request.body(args.body) :
    ({options}) => ({options})
  )(),
  (() => ({options, body}) =>
    args.auth ? Request.auth(args.auth)({options, body}) : {options, body}
  )(),
  (() => ({options, body}) =>
    body ? Request.length()({options, body}) : {options}
  )(),

  Request.send(),

  Response.buffer(),
  Response.parse(),
  Response.status(),

)()


compose.client = client
compose.Request = Request
compose.Response = Response
module.exports = compose
