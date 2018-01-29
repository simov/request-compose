
module.exports = () => ({options, options: {headers}, body}) => {

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'transfer-encoding')

  if (!header || headers[header] !== 'chunked') {
    headers['content-length'] = body.length
  }

  return {options, body}
}
