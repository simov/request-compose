
var compose = require('request-compose')

var search = ((
  github = compose(
    ({query}) => compose.client({
      url: 'https://api.github.com/search/repositories',
      qs: {q: query},
      headers: {'user-agent': 'request-compose'},
    }),
    ({body}) => body.items.slice(0, 3)
      .map(({full_name, html_url}) => ({name: full_name, url: html_url})),
  ),
  gitlab = compose(
    ({query, token}) => compose.client({
      url: 'https://gitlab.com/api/v4/search',
      qs: {scope: 'projects', search: query},
      headers: {'authorization': `Bearer ${token}`},
    }),
    ({body}) => body.slice(0, 3)
      .map(({path_with_namespace, web_url}) =>
        ({name: path_with_namespace, url: web_url})),
  ),
  bitbucket = compose(
    ({query}) => compose.client({
      url: 'https://bitbucket.org/repo/all',
      qs: {name: query},
    }),
    ({body}) => body.match(/repo-link" href="[^"]+"/gi).slice(0, 3)
      .map((match) => match.replace(/repo-link" href="\/([^"]+)"/i, '$1'))
      .map((path) => ({name: path, url: `https://bitbucket.org/${path}`})),
  ),
  search = compose(
    ({query, cred}) => Promise.all([
      github({query}),
      gitlab({query, token: cred.gitlab}),
      bitbucket({query}),
    ]),
    (results) => results.reduce((all, results) => all.concat(results)),
  )) =>
    Object.assign(search, {github, gitlab, bitbucket})
)()

;(async () => {
  var cred = {gitlab: '[TOKEN]'}
  try {
    var results = await search({query: 'request', cred})
    console.log(results)
  }
  catch (err) {
    console.error(err)
  }
})()
