
module.exports = () => ({options, options: {headers}, body}) => {

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'transfer-encoding')

  if (!header || headers[header] !== 'chunked') {
    headers['content-length'] = Buffer.byteLength(body)
  }

  return {options, body}
}
