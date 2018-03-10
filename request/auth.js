
module.exports = ({user, pass}) => ({options, options: {headers}, body}) => {

  headers.Authorization =
    `Basic ${Buffer.from(`${user}:${pass || ''}`, 'utf8').toString('base64')}`

  return {options, body}
}
