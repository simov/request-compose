
var error = require('../utils/error')
var redirect = require('./redirect')


module.exports = () => ({options, res, body, raw = body}) => {

  if (/^2/.test(res.statusCode)) {
    return {options, res, body, raw}
  }
  else if (/^3/.test(res.statusCode)) {
    return redirect()({options, res, body, raw})
  }
  else if (/^4/.test(res.statusCode)) {
    throw error({options, res, body, raw})
  }
  else if (/^5/.test(res.statusCode)) {
    throw error({options, res, body, raw})
  }

}
