
module.exports = ({res, body, raw = body}) => {
  var error = new Error()

  error.message = `${res.statusCode} ${res.statusMessage}`

  error.res = res
  error.body = body
  error.raw = raw

  return error
}
