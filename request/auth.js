
module.exports = (auth) => ({options, options: {headers}, body}) => {

  if (typeof auth === 'object') {
    headers.Authorization =
      `Basic ${Buffer.from(`${auth.user}:${auth.pass || ''}`, 'utf8').toString('base64')}`
    delete options.auth
  }

  return {options, body}
}
