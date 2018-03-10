
module.exports = () => ({res, body, raw = body}) => {

  if (!/^2/.test(res.statusCode)) {
    var err = new Error()

    err.message = res.statusCode + ' ' + res.statusMessage

    err.res = res
    err.body = body
    err.raw = raw

    throw err
  }

  return {res, body, raw}

}
