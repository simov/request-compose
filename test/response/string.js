
var t = require('assert')

var Response = {
  string: require('../../response/string'),
}


describe('string', () => {

  it('utf8 encoding by default', async () => {
    var {body} = await Response.string()({body: Buffer.from('λ')})
    t.equal(
      body,
      'λ',
      'utf8 encoding by default'
    )
  })

  it('set encoding', async () => {
    var {body} = await Response.string('base64')({body: Buffer.from('λ')})
    t.equal(
      body,
      'zrs=',
      'set base64 encoding'
    )
  })

})
