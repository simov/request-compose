
var error = require('../utils/error')


module.exports = () => ({res, body, raw = body}) => {

  if (!/^2/.test(res.statusCode)) {
    throw error({res, body, raw})
  }

  return {res, body, raw}

}
