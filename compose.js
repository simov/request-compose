
var compose = (...fns) => (args) =>
  fns.reduce((p, f) => p.then(f), Promise.resolve(args))


var load = (type, middlewares) => middlewares
  .reduce((all, mw) => (all[mw] = require(`./${type}/${mw}`), all), {})


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
  'string',
  'parse',
  'status',
  'redirect',
])


var utils = load('utils', [
  'error',
  'log',
])


var request = (args) => compose(

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
    args.multipart ? Request.multipart(args.multipart) :
    args.body ? Request.body(args.body) :
    ({options}) => ({options})
  )(),

  (() =>
    args.auth ? Request.auth(args.auth) :
    args.oauth ? Request.oauth(args.oauth) :
    ({options, body}) => ({options, body})
  )(),

  (() => ({options, body}) =>
    body ? Request.length()({options, body}) : {options}
  )(),

  Request.send(),

)()


var client = (args) => compose(

  _ => request(args),

  Response.buffer(),
  Response.string(args.encoding),
  Response.parse(),

  Response.status(),
  Response.redirect(args, client),

)()


var buffer = (args) => compose(

  _ => request(args),

  Response.buffer(),

  Response.status(),
  Response.redirect(args, buffer),

)()


var stream = (args) => compose(

  _ => request(args),

  Response.status(),
  // TODO: should buffer the read chunks and re-write them
  // Response.redirect(args, stream),

)()


compose.Request = Request
compose.Response = Response
compose.client = client
compose.buffer = buffer
compose.stream = stream
module.exports = compose
