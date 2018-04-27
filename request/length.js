
module.exports = () => ({options, options: {headers}, body}) => {

  var encoding = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'transfer-encoding')

  var length = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-length')

  if (headers[encoding] === 'chunked' || headers[length]) {
    return {options, body}
  }

  if (typeof body === 'string') {
    headers['content-length'] = Buffer.byteLength(body)
  }
  else if (body instanceof Buffer) {
    headers['content-length'] = body.length
  }

  return {options, body}
}
