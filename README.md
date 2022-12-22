
# request-compose

[![npm-version]][npm] [![test-ci-img]][test-ci-url] [![test-cov-img]][test-cov-url] [![snyk-vulnerabilities]][snyk]

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
  - [client](#client) / [buffer](#buffer) / [stream](#stream) / [options](#options) / [extend](#extend)
- [**Errors**](#errors)
- [Debug **Logs**](#debug-logs)
- [**Examples**](#examples)


# Compose

> In computer science, __[function composition][function-composition]__ (not to be confused with object composition) is an act or mechanism to combine simple functions to build more complicated ones. Like the usual composition of functions in mathematics, the result of each function is passed as the argument of the next, and the result of the last one is the result of the whole.

```js
var compose = require('request-compose')
```

Accepts a list of functions to execute and returns a [Promise]:

```js
var doit = compose(
  (a) => a + 2,
  (a) => a * 2,
)
```

Then we can call it:

```js
var result = await doit(5) // 14
```

A more practical example however would be to compose our own HTTP client:

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

| Type | Middleware | Input | Arguments | Returns
| :--- | :---       | :---  | :---      | :---
| Request | defaults | {input} | {input} | {options}
| Request | url, proxy, qs, cookie | see [options](#options) | {options} | {options}
| Request | form, json, multipart, body | see [options](#options) | {options} | {options, body}
| Request | auth, oauth | see [options](#options) | {options, body} | {options, body}
| Request | length | - | {options, body} | {options, body}
| Request | send | - | {options, body} | {options, res}
| Response | buffer | - | {options, res} | {options, res, body}
| Response | gzip | - | {options, res, body, raw} | {options, res, body, raw}
| Response | string | see [options](#options) | {options, res, body, raw} | {options, res, body, raw}
| Response | parse, status | - | {options, res, body, raw} | {options, res, body, raw}
| Response | redirect | (input, client) | {options, res, body, raw} | new composition


# Opinionated Client

`request-compose` comes with opinionated HTTP client that is composed of the above [middlewares](#bundled-middlewares).

There are 3 types of composition available based on the returned data type:

## client

```js
var request = require('request-compose').client
var {res, body} = await request({options})
```

The `client` composition does the following:

- buffers the response body
- decompresses `gzip` and `deflate` encoded bodies with valid `content-encoding` header
- converts the response body to string using `utf8` encoding by default
- tries to parse `JSON` and `querystring` encoded bodies with valid `content-type` header

Returns either String or Object.

## buffer

```js
var request = require('request-compose').buffer
var {res, body} = await request({options})
```

The `buffer` composition does the following:

- buffers the response body
- decompresses `gzip` and `deflate` encoded bodies with valid `content-encoding` header

Returns [Buffer][buffer].

## stream

```js
var request = require('request-compose').stream
var {res} = await request({options})
```

The `stream` composition returns the response [Stream][stream-incoming-message].

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

Additionally the following options are available:

| Option     | Type                  | Description
| :--        | :--                   | :--
| `url`      | `'string'` [`url object`][url-parse] | URL _(encoding - see below)_
| `proxy`    | `'string'` [`url object`][url-parse] | Proxy URL
| `qs`       | `{object}` `'string'` | URL querystring _(encoding - see below)_
| `form`     | `{object}` `'string'` | application/x-www-form-urlencoded request body _(encoding - see below)_
| `json`     | `{object}` `'string'` | JSON encoded request body
| `multipart`| `{object}` `[array]`  | multipart request body using [request-multipart], see [examples](#external-middlewares)
| `body`     | `'string'` [`Buffer`][buffer] [`Stream`][stream-readable] | request body
| `auth`     | `{user, pass}`        | Basic authorization
| `oauth`    | `{object}` | OAuth 1.0a authorization using [request-oauth], see [examples](#external-middlewares)
| `encoding` | [`'string'`][buffer-encoding] | response body encoding _(default: 'utf8')_
| `cookie`   | `{object}` | cookie store using [request-cookie], see [examples](#external-middlewares)
| `redirect` | `{object}` | _see below_

> Querystring set in the `url`, and/or in `qs` and/or in `form` as _'string'_ is left untouched, meaning that the proper encoding is left to the user.

> When `qs` and/or `form` is _{object}_ the querystring is encoded using the Node's [querystring] module which mirrors the global [encodeURIComponent][encodeuri] method. Additionally all reserved characters according to RFC3986 are encoded as well. Full list of all reserved characters that are being encoded can be found [here][reserved-characters].

#### redirect

| Option    | Default | Description
| :--       | :--     | :--
| `max`     | *3*     | maximum number of redirects to follow
| `all`     | *false* | follow non-GET HTTP 3xx responses as redirects
| `method`  | *true*  | follow original HTTP method, otherwise convert all redirects to GET
| `auth`    | *true*  | keep Authorization header when changing hostnames
| `referer` | *false* | add Referer header

## extend

Extend or override any of the bundled [request][request-middlewares] and [response][response-middlewares] middlewares:

```js
var request = require('request-compose').extend({
  Request: {
    oauth: require('request-oauth'),
    multipart: require('request-multipart'),
    cookie: require('request-cookie').Request
  },
  Response: {cookie: require('request-cookie').Response},
}).client
```

# Errors

Non `200/300` responses are thrown as [Error] object with the following properties:

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

| Topic | Example
| :--   | :--
| **`Basics`** |
| Types of lambda functions | [Get GitHub user profile](https://github.com/simov/request-compose/blob/master/examples/basic-lambda.js)
| Bundled middlewares | [Get GitHub user profile](https://github.com/simov/request-compose/blob/master/examples/basic-middlewares.js)
| Wrap it up and extend it | [Get GitHub user profile](https://github.com/simov/request-compose/blob/master/examples/basic-extend.js)
| **`Compositions`** |
| Client | [Get GitHub user profile](https://github.com/simov/request-compose/blob/master/examples/compose-client.js)
| Buffer | [Decoding response body using iconv-lite](https://github.com/simov/request-compose/blob/master/examples/compose-buffer.js)
| Stream | [Stream Tweets](https://github.com/simov/request-compose/blob/master/examples/compose-stream.js)
| **`External Middlewares`** |
| OAuth ([request-oauth]) | [Get Twitter User Profile](https://github.com/simov/request-compose/blob/master/examples/mw-oauth.js)
| Multipart ([request-multipart]) | [Upload photo to Twitter](https://github.com/simov/request-compose/blob/master/examples/mw-multipart.js)
| Cookie ([request-cookie]) | [Login to Wallhaven.cc](https://github.com/simov/request-compose/blob/master/examples/mw-cookie.js)
| **`Stream`** |
| Stream request body | [Upload file to Dropbox](https://github.com/simov/request-compose/blob/master/examples/stream-dropbox-upload.js)
| HTTP stream | [Upload image from Dropbox to Slack](https://github.com/simov/request-compose/blob/master/examples/stream-dropbox-to-slack.js)
| HTTP stream | [Copy file from Dropbox to GDrive](https://github.com/simov/request-compose/blob/master/examples/stream-dropbox-to-gdrive.js)
| **`Misc`** |
| Gzip decompression | [Request Gzip compressed body](https://github.com/simov/request-compose/blob/master/examples/misc-gzip.js)
| HTTPS proxy | [Tunnel Agent](https://github.com/simov/request-compose/blob/master/examples/misc-tunnel-agent.js)
| HTTPS proxy | [Proxy Agent](https://github.com/simov/request-compose/blob/master/examples/misc-proxy-agent.js)
| Override bundled middleware - per compose instance | [Override the `qs` middleware](https://github.com/simov/request-compose/blob/master/examples/misc-extend.js)
| Override bundled middleware - process-wide | [Override the `form` and the `parse` middlewares to use the `qs` module](https://github.com/simov/request-compose/blob/master/examples/misc-override.js)
| **`Pipeline`** |
| App pipeline | [Slack Weather Status](https://github.com/simov/request-compose/blob/master/examples/pipe-slack-weather-status.js)
| App pipeline | [Simultaneously search for repos in GitHub, GitLab and BitBucket](https://github.com/simov/request-compose/blob/master/examples/pipe-repo-search.js)
| **`Modules`** |
| Google Chrome Web Store HTTP Client | [chrome-webstore]
| REST API Client Library | [purest]


  [npm-version]: https://img.shields.io/npm/v/request-compose.svg?style=flat-square (NPM Version)
  [test-ci-img]: https://img.shields.io/travis/simov/request-compose/master.svg?style=flat-square (Build Status)
  [test-cov-img]: https://img.shields.io/coveralls/simov/request-compose.svg?style=flat-square (Test Coverage)
  [snyk-vulnerabilities]: https://img.shields.io/snyk/vulnerabilities/npm/request-compose.svg?style=flat-square (Vulnerabilities)

  [npm]: https://www.npmjs.com/package/request-compose
  [test-ci-url]: https://github.com/simov/request-compose/actions/workflows/test.yml
  [test-cov-url]: https://coveralls.io/r/simov/request-compose?branch=master
  [snyk]: https://snyk.io/test/npm/request-compose

  [function-composition]: https://en.wikipedia.org/wiki/Function_composition_(computer_science)
  [pipeline]: https://en.wikipedia.org/wiki/Pipeline_(software)
  [pipe-operator]: https://github.com/tc39/proposal-pipeline-operator

  [chunked]: https://en.wikipedia.org/wiki/Chunked_transfer_encoding

  [request-middlewares]: https://github.com/simov/request-compose/tree/master/request
  [response-middlewares]: https://github.com/simov/request-compose/tree/master/response
  [request-oauth]: https://www.npmjs.com/package/request-oauth
  [request-multipart]: https://www.npmjs.com/package/request-multipart
  [request-cookie]: https://www.npmjs.com/package/request-cookie
  [request-logs]: https://www.npmjs.com/package/request-logs

  [promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
  [error]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error

  [buffer]: https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html
  [buffer-encoding]: https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html#buffer_buffers_and_character_encodings
  [stream-readable]: https://nodejs.org/dist/latest-v10.x/docs/api/stream.html#stream_class_stream_readable
  [stream-incoming-message]: https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_class_http_incomingmessage
  [http-request]: https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_http_request_options_callback
  [https-request]: https://nodejs.org/dist/latest-v14.x/docs/api/https.html#https_https_request_options_callback
  [url-parse]: https://nodejs.org/dist/latest-v10.x/docs/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost
  [querystring-parse]: https://nodejs.org/dist/latest-v10.x/docs/api/querystring.html#querystring_querystring_parse_str_sep_eq_options
  [querystring]: https://nodejs.org/dist/latest-v10.x/docs/api/querystring.html
  [encodeuri]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
  [reserved-characters]: https://en.wikipedia.org/wiki/Percent-encoding#Types_of_URI_characters

  [chrome-webstore]: https://github.com/simov/chrome-webstore
  [purest]: https://github.com/simov/purest
