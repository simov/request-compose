
var querystring = require('querystring')
var log = require('../utils/log')


module.exports = () => ({options, res, res: {headers}, body}) => {

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  var raw = body

  if (/json|javascript/.test(headers[header])) {
    try {
      body = JSON.parse(body)
    }
    catch (err) {}
  }

  else if (/application\/x-www-form-urlencoded/.test(headers[header])) {
    try {
      body = querystring.parse(body)
    }
    catch (err) {}
  }

  log({json: body})

  return {options, res, body, raw}

}
