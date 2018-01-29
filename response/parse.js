
var querystring = require('querystring')


module.exports = () => ({res, res: {headers}, body}) => {

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  if (!header) {
    return {res, body}
  }

  if (/application\/json/.test(headers[header])) {
    return {res, body: JSON.parse(body)}
  }

  if (/application\/x-www-form-urlencoded/.test(headers[header])) {
    return {res, body: querystring.parse(body)}
  }

}
