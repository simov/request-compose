
var error = require('../utils/error')
var log = require('../utils/log')


module.exports = () => ({options, res, body, raw}) => {

  log({status: {res, body, raw}})

  if (/^(4|5)/.test(res.statusCode)) {
    throw error({options, res, body, raw})
  } else {
    return {options, res, body, raw}
  }

}
