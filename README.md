
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

- **[Compose](#compose)**
- **[Middlewares](#middlewares)**
- **[Client](#client)**
- **[Examples]**

# Compose

```js
var https = require('https')
var compose = require('request-compose')

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

# Middlewares

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

# Client

```js
var request = require('request-compose').client

;(async () => {
  try {
    var {res, body} = await request({
      url: 'https://api.github.com/users/simov',
      headers: {
        'user-agent': 'request-compose'
      }
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


  [npm-version]: https://img.shields.io/npm/v/request-compose.svg?style=flat-square (NPM Package Version)
  [travis-ci]: https://img.shields.io/travis/simov/request-compose/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/simov/request-compose.svg?style=flat-square (Test Coverage - Coveralls)
  [codecov-status]: https://img.shields.io/codecov/c/github/simov/request-compose.svg?style=flat-square (Test Coverage - Codecov)

  [npm]: https://www.npmjs.com/package/request-compose
  [travis]: https://travis-ci.org/simov/request-compose
  [coveralls]: https://coveralls.io/github/simov/request-compose
  [codecov]: https://codecov.io/github/simov/request-compose?branch=master

  [examples]: https://github.com/simov/request-compose/blob/master/examples

  [pipe-operator]: https://github.com/tc39/proposal-pipeline-operator
  [http-options]: https://nodejs.org/dist/latest-v9.x/docs/api/http.html#http_http_request_options_callback
  [https-options]: https://nodejs.org/dist/latest-v9.x/docs/api/https.html#https_https_request_options_callback
