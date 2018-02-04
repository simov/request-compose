
module.exports = () => ({res, body}) => {

  if (!/^2/.test(res.statusCode)) {
    throw new Error([
      res.statusCode,
      res.statusMessage,
      body,
    ].join(' '))
  }

  return {res, body}

}
