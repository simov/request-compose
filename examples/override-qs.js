
var request = require('request-compose').override({
  Request: {
    qs: (qs) => ({options}) => {
      // q=language:javascript+stars:>50
      var q = Object.keys(qs.q).map((key) => `${key}:${qs.q[key]}`).join('+')
      qs = Object.assign({}, qs, {q})
      // &sort=stars&order=desc
      var str = Object.keys(qs).map((key) => `${key}=${qs[key]}`).join('&')
      options.path += `?${str}`
      return {options}
    }
  }
}).client

;(async () => {
  var language = 'javascript'
  try {
    var {body: {total_count:repos}} = await request({
      url: 'https://api.github.com/search/repositories',
      qs: {
        q: {language, stars: '>50'},
        sort: 'stars',
        order: 'desc',
      },
      headers: {
        'user-agent': 'request-compose',
      }
    })
    console.log(language, repos)
  }
  catch (err) {
    console.error(err)
  }
})()
