
var log = require('../utils/log')


module.exports = (encoding) => ({options, res, body, raw}) => {

  raw = body

  body = Buffer.from(body).toString(encoding)

  log({string: {res, body}})

  return {options, res, body, raw}

}
