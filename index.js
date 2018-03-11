
module.exports = (() =>
  parseInt(process.version.replace('v', '').split('.')[0]) >= 8
    ? require('../compose')
    : require('./compose')
)()
