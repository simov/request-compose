
var compose = require('../')
compose.Request.oauth = require('request-oauth')
var request = compose.stream // !

var JSONStream = require('JSONStream')
var json = JSONStream.parse()

var chalk = require('chalk')


;(async () => {

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

  json.on('data', (data) => {
    if (data.user) {
      console.log(
        chalk.bgGreen(data.user.id),
        chalk.magenta(data.user.name),
        chalk.bold(data.user.screen_name),
        chalk.bgBlue(data.id),
        chalk.yellow(data.text),
      )
    }
  })

  res.pipe(json)

})()
