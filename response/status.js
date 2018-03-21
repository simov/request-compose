
var error = require('../utils/error')


module.exports = () => ({options, res, body, raw}) => {

  if (/^(2|3)/.test(res.statusCode)) {
    return {options, res, body, raw}
  }
  else if (/^(4|5)/.test(res.statusCode)) {
    throw error({options, res, body, raw})
  }

}
