
module.exports = (json) => ({options, options: {headers}}) => {

  json = typeof json === 'object' ? JSON.stringify(json) : (json || '')

  var header = Object.keys(headers)
    .find((name) => name.toLowerCase() === 'content-type')

  if (!header) {
    headers['content-type'] = 'application/json'
  }

  return {options, body: json}
}
