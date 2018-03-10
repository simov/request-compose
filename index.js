
module.exports = (() =>
  process.env.SOURCE
    ? require('../compose')
    : require('./compose')
)()
