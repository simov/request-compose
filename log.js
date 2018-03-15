
module.exports = (data) => {
  if (process.env.DEBUG) {
    try {
      require('request-logs')(data)
    }
    catch (err) {}
  }
}
