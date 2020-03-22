
var ctor = () => (...fns) => (args) =>
  fns.reduce((p, f) => p.then(f), Promise.resolve(args))

var compose = ctor()


var load = (type, middlewares) => middlewares
  .reduce((all, mw) => (all[mw] = require(`./${type}/${mw}`), all), {})


var Request = load('request', [
  'defaults',
  'url',
  'proxy',
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
  'gzip',
  'string',
  'parse',
  'status',
  'redirect',
])


var utils = load('utils', [
  'error',
  'log',
])


var request = (Request) => (args) => compose(

  Request.defaults(args),

  (() =>
    args.url ? Request.url(args.url) : ({options}) => ({options})
  )(),
  (() =>
    args.proxy ? Request.proxy(args.proxy) : ({options}) => ({options})
  )(),
  (() =>
    args.qs ? Request.qs(args.qs, args.redirect) : ({options}) => ({options})
  )(),

  (() =>
    args.cookie ? Request.cookie(args.cookie) : ({options}) => ({options})
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


var client = (Request, Response) => (args) => compose(

  _ => request(Request)(args),

  (() =>
    args.cookie ? Response.cookie(args.cookie) :
      ({options, res}) => ({options, res})
  )(),

  Response.buffer(),
  Response.gzip(),
  Response.string(args.encoding),
  Response.parse(),

  Response.status(),
  Response.redirect(args, client(Request, Response)),

)()


var buffer = (Request, Response) => (args) => compose(

  _ => request(Request)(args),

  (() =>
    args.cookie ? Response.cookie(args.cookie) :
      ({options, res}) => ({options, res})
  )(),

  Response.buffer(),
  Response.gzip(),

  Response.status(),
  Response.redirect(args, buffer(Request, Response)),

)()


var stream = (Request, Response) => (args) => compose(

  _ => request(Request)(args),

  (() =>
    args.cookie ? Response.cookie(args.cookie) :
      ({options, res}) => ({options, res})
  )(),

  Response.status(),
  // TODO: should buffer the read chunks and re-write them
  // Response.redirect(args, stream),

)()


var extend = (mw) => ((
    req = Object.assign({}, Request, mw.Request),
    res = Object.assign({}, Response, mw.Response),
  ) =>
    Object.assign(ctor(), {
      Request: req,
      Response: res,
      client: client(req, res),
      buffer: buffer(req, res),
      stream: stream(req, res),
      extend,
    })
  )()


module.exports = extend({Request, Response})
