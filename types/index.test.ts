import compose from 'index'

const { Request, Response } = compose

const run = async () => {
  try {
    const { res, body } = await compose(
      Request.defaults({headers: {'user-agent': 'request-compose'}}),
      Request.url('https://api.github.com/users/simov'),
      Request.send(),
      Response.buffer(),
      Response.string(),
      Response.parse(),
    )()
    console.log(res.statusCode, res.statusMessage)
    console.log(res.headers['x-ratelimit-remaining'])
    console.log(body)
  } catch (err) {
    console.error(err)
  }
}

run()
