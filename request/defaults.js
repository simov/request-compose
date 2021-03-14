
var options = [
  // https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_http_request_options_callback
  'agent',
  'auth',
  'createConnection',
  'defaultPort',
  'family',
  'headers',
  'host',
  'hostname',
  'insecureHTTPParser',
  'localAddress',
  'lookup',
  'maxHeaderSize',
  'method',
  'path',
  'port',
  'protocol',
  'setHost',
  'socketPath',
  'timeout',
  // https://nodejs.org/dist/latest-v14.x/docs/api/https.html#https_https_request_options_callback
  'ca',
  'cert',
  'ciphers',
  'clientCertEngine',
  'crl',
  'dhparam',
  'ecdhCurve',
  'honorCipherOrder',
  'key',
  'passphrase',
  'pfx',
  'rejectUnauthorized',
  'secureOptions',
  'secureProtocol',
  'servername',
  'sessionIdContext',
  'highWaterMark',
]


module.exports = (_args = {}) => (args = _args) => {

  var defaults = {
    protocol: args.protocol || 'http:',
    hostname: args.hostname || 'localhost',
    port: args.port || 80,
    method: (args.method || 'GET').toUpperCase(),
    path: args.path || '/',
    headers: args.headers ? JSON.parse(JSON.stringify(args.headers)) : {},
    timeout: args.timeout || 5000,
  }

  return {
    options: options.reduce((http, option) => (
      defaults[option] !== undefined ? http[option] = defaults[option] :
      args[option] !== undefined ? http[option] = args[option] :
      null,
      http
    ), {})
  }
}
