
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

- **[Compose](#compose)**
- **[Middlewares](#middlewares)**
- **[Client](#client)**
- **[Buffer](#buffer)**
- **[Stream](#stream)**
- **[OAuth](#oauth)**
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

# Buffer

```js
var compose = require('request-compose')
var iconv = require('iconv-lite')

var request = (options) => compose(
  _ => compose.buffer(options), // !
  ({res, body}) => ({res, body: iconv.decode(body, options.encoding)}),
)()

;(async () => {
  try {
    var {body} = await request({
      url: 'https://raw.githubusercontent.com/simov/markdown-viewer/master/test/encoding/windows-1251.md',
      encoding: 'windows-1251',
    })
    console.log(body)
  }
  catch (err) {
    console.error(err)
  }
})()
```

# Stream

```js
var compose = require('request-compose')
compose.Request.oauth = require('request-oauth')
var request = compose.stream // !
var json = require('JSONStream')


;(async () => {
  try {
    var {res} = await request({
      url: 'https://stream.twitter.com/1.1/statuses/filter.json',
      qs: {
        track: 'twitter',
      },
      oauth: {
        consumer_key: '[APP ID]',
        consumer_secret: '[APP SECRET]',
        token: '[ACCESS TOKEN]',
        token_secret: '[ACCESS SECRET]',
      }
    })
    res.pipe(json.parse()).on('data', (data) => {
      if (data.user) {
        console.log(data.user.id, data.user.name, data.user.screen_name)
        console.log(data.id, data.text)
        console.log('----------------')
      }
    })
  }
  catch (err) {
    console.error(err)
  }
})()
```

# OAuth

```js
var compose = require('request-compose')
compose.Request.oauth = require('request-oauth')
var request = compose.client

;(async () => {
  try {
    var {body:user} = await request({
      url: 'https://api.twitter.com/1.1/users/show.json',
      qs: {
        screen_name: '[SCREEN NAME]'
      },
      oauth: {
        consumer_key: '[APP ID]',
        consumer_secret: '[APP SECRET]',
        token: '[ACCESS TOKEN]',
        token_secret: '[ACCESS SECRET]',
      }
    })
    console.log(user)
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
