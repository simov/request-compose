
# request-compose

[![npm-version]][npm] [![travis-ci]][travis] [![coveralls-status]][coveralls]

> _Composable HTTP Client_

```js
var compose = require('request-compose')
var Request = compose.Request
var Response = compose.Response

;(async () => {
  try {
    var {res, body} = await compose(
      Request.defaults({headers: {'user-agent': 'request-compose'}}),
      Request.url('https://api.github.com/users/simov'),
      Request.send(),
      Response.buffer(),
      Response.string(),
      Response.parse(),
    )()
    console.log(res.statusCode, res.statusMessage)
    console.log(res.headers['x-ratelimit-remaining'])
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
```

# Goals

- **No dependencies**
- **No abstraction**
- **No state**


# Table of Contents

- [**Compose**](#compose)
- [Bundled **Middlewares**](#bundled-middlewares)
- [Opinionated **Client**](#opinionated-client)
  - [client](#client)
  - [buffer](#buffer)
  - [stream](#stream)
  - [options](#options)
- [**Errors**](#errors)
- [Debug **Logs**](#debug-logs)
- [**Examples**](#examples)


# Compose

> In computer science, __function composition__ (not to be confused with object composition) is an act or mechanism to combine simple functions to build more complicated ones. Like the usual composition of functions in mathematics, the result of each function is passed as the argument of the next, and the result of the last one is the result of the whole.

> _source: [Wikipedia][function-composition]_

```js
var compose = require('request-compose')
```

Accepts a list of functions to execute and returns a [Promise]:

```js
var doit = compose(
  (a) => a + 2,
  (a) => b * 2,
)
```

Then we can call it:

```js
var result = await doit(5) // 14
```

A more practical example however would be to implement our own HTTP client:

```js
var compose = require('request-compose')
var https = require('https')

var request = compose(
  (options) => {
    options.headers = options.headers || {}
    options.headers['user-agent'] = 'request-compose'
    return options
  },
  (options) => new Promise((resolve, reject) => {
    https.request(options)
      .on('response', resolve)
      .on('error', reject)
      .end()
  }),
  async (res) => await new Promise((resolve, reject) => {
    var body = ''
    res
      .on('data', (chunk) => body += chunk)
      .on('end', () => resolve({res, body}))
      .on('error', reject)
  }),
  ({res, body}) => ({res, body: JSON.parse(body)}),
)
```

Then we can use it like this:

```js
;(async () => {
  try {
    var {res, body} = await request({
      protocol: 'https:',
      hostname: 'api.github.com',
      path: '/users/simov',
    })
    console.log(res.statusCode, res.statusMessage)
    console.log(res.headers['x-ratelimit-remaining'])
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
```

# Bundled Middlewares

`request-compose` comes with a bunch of pre-defined middlewares for transforming the [request][request-middlewares] and the [response][response-middlewares]:

```js
var compose = require('request-compose')
var Request = compose.Request
var Response = compose.Response
```

We can use these middlewares to compose our own HTTP client:

```js
;(async () => {
  try {
    var {res, body} = await compose(
      Request.defaults({headers: {'user-agent': 'request-compose'}}),
      Request.url('https://api.github.com/users/simov'),
      Request.send(),
      Response.buffer(),
      Response.string(),
      Response.parse(),
    )()
    console.log(res.statusCode, res.statusMessage)
    console.log(res.headers['x-ratelimit-remaining'])
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
```

# Opinionated Client

`request-compose` comes with opinionated HTTP client that is [composed][function-composition] of the above [middlewares](#bundled-middlewares).

There are 3 types of composition available based on the returned data type:

## client

```js
var request = require('request-compose').client
var {res, body} = await request({options})
```

The `client` composition parses the response `body` to string using `utf8` encoding by default. Additonally it tries to parse JSON and Querystring response bodies with valid `content-type`.

## buffer

```js
var request = require('request-compose').buffer
var {res, body} = await request({options})
```

The `buffer` composition returns the response `body` as raw [Buffer][buffer].

## stream

```js
var request = require('request-compose').stream
var {res} = await request({options})
```

The `stream` composition returns the `response` [Stream][stream-incoming-message].

## options

The above compositions accept any of the Node's [http.request][http-request] and [https.request][https-request] options:

```js
var {res, body} = await request({
  method: 'GET',
  url: 'https://api.github.com/users/simov',
  headers: {
    'user-agent': 'request-compose'
  }
})
```

Additionally the following options are supported:

Option     | Type     | Default | Description
:--        | :--      | :--     | :--
`url`      | `'string'` [`url object`][url-parse] | *undefined* | URL
`qs`       | `{object}` `'string'` | *undefined* | URL querystring
`form`     | `{object}` `'string'` | *undefined* | request body
`json`     | `{object}` `'string'` | *undefined* | request body
`body`     | `'string'` [`Buffer`][buffer] [`Stream`][stream-readable] | *undefined* | request body
`auth`     | `{user, pass}` | *undefined* | basic authorization
`oauth`    | `{object}` | *undefined* | OAuth authorization, see [request-oauth]
`encoding` | [`'string'`][buffer-encoding] | *'utf8'* | response body encoding
`redirect` | `{object}` | |
.          | `max`    | *3*        | maximum number of redirects to follow
.          | `all`    | *false*    | follow non-GET HTTP 3xx responses as redirects
.          | `method` | *true*     | follow original HTTP method, otherwise convert all redirects to GET
.          | `auth`   | *true*     | keep Authorization header when changing hostnames
.          | `referer`| *false*    | add Referer header


# Errors

Non `200/300` responses are returned as [Error] object with the following properties:

- `message` - status code + status message
- `res` - the response object
- `body` - the parsed response body
- `raw` - the raw response body


# Debug Logs

Fancy [request-logs]:

```bash
npm i --save-dev request-logs
```

Pick any of the following debug options:

```bash
DEBUG=req,res,body,json,nocolor node app.js
```

# Examples

Topic | Example
:--   | :--
Types of lambda functions | [Get GitHub user profile](https://github.com/simov/request-compose/blob/master/examples/basic-compose.js)
Bundled middlewares | [Get GitHub user profile](https://github.com/simov/request-compose/blob/master/examples/basic-middlewares.js)
Client composition | [Get GitHub user profile](https://github.com/simov/request-compose/blob/master/examples/basic-client.js)
Buffer composition | [Decoding response body using iconv-lite](https://github.com/simov/request-compose/blob/master/examples/buffer-decoding-iconv.js)
Stream composition | [Stream Tweets](https://github.com/simov/request-compose/blob/master/examples/stream-tweets.js)
OAuth middleware | [Get Twitter User Profile](https://github.com/simov/request-compose/blob/master/examples/oauth.js)
Override bundled middleware | [Override the `parse` middleware to use the `qs` module](https://github.com/simov/request-compose/blob/master/examples/mw-override.js)
Stream request body | [Upload file to Dropbox](https://github.com/simov/request-compose/blob/master/examples/dropbox-upload.js)
Pipeline | [Slack Weather Status](https://github.com/simov/request-compose/blob/master/examples/slack-weather-status.js)


  [npm-version]: https://img.shields.io/npm/v/request-compose.svg?style=flat-square (NPM Package Version)
  [travis-ci]: https://img.shields.io/travis/simov/request-compose/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/simov/request-compose.svg?style=flat-square (Test Coverage - Coveralls)
  [codecov-status]: https://img.shields.io/codecov/c/github/simov/request-compose.svg?style=flat-square (Test Coverage - Codecov)

  [npm]: https://www.npmjs.com/package/request-compose
  [travis]: https://travis-ci.org/simov/request-compose
  [coveralls]: https://coveralls.io/github/simov/request-compose
  [codecov]: https://codecov.io/github/simov/request-compose?branch=master

  [function-composition]: https://en.wikipedia.org/wiki/Function_composition_(computer_science)
  [pipeline]: https://en.wikipedia.org/wiki/Pipeline_(software)
  [pipe-operator]: https://github.com/tc39/proposal-pipeline-operator

  [request-middlewares]: https://github.com/simov/request-compose/tree/v0.0.14/request
  [response-middlewares]: https://github.com/simov/request-compose/tree/v0.0.14/response
  [request-oauth]: https://www.npmjs.com/package/request-oauth
  [request-logs]: https://www.npmjs.com/package/request-logs

  [promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  [error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

  [buffer]: https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html
  [buffer-encoding]: https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html#buffer_buffers_and_character_encodings
  [stream-readable]: https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_class_stream_readable
  [stream-incoming-message]: https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_incomingmessage
  [http-request]: https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_http_request_options_callback
  [https-request]: https://nodejs.org/dist/latest-v10.x/docs/api/https.html#https_https_request_options_callback
  [url-parse]: https://nodejs.org/dist/latest-v10.x/docs/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost
  [querystring-parse]: https://nodejs.org/dist/latest-v10.x/docs/api/querystring.html#querystring_querystring_parse_str_sep_eq_options
