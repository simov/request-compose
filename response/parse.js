
var querystring = require('querystring')


module.exports = () => ({res, res: {headers}, body}) => {

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  if (/json|javascript/.test(headers[header])) {
    try {
      body = JSON.parse(body)
    }
    catch (err) {}
  }

  if (/application\/x-www-form-urlencoded/.test(headers[header])) {
    try {
      body = querystring.parse(body)
    }
    catch (err) {}
  }

  return {res, body}

}
