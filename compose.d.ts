/// <reference types="node" />
import '@types/node'
import * as http from 'http'
import * as https from 'https'
import * as stream from 'stream'

// ----------------------------------------------------------------------------

/**
 * Node core HTTP request options
 * | [docs](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_http_request_options_callback)
 */
interface NodeCoreHttpOptions {
  /**
   * Agent
   */
  agent?: boolean | https.Agent | http.Agent
  /**
   * Basic authentication
   */
  auth?: string
  /**
   * A function that produces a socket/stream to use for the request
   */
  createConnection?: Function
  /**
   * Default port for the protocol
   */
  defaultPort?: number
  /**
   * IP address family to use when resolving host or hostname
   */
  family?: number
  /**
   * Request headers
   */
  headers?: object
  /**
   * Hostname
   */
  host?: string
  /**
   * Hostname
   */
  hostname?: string
  /**
   * Use an insecure HTTP parser that accepts invalid HTTP headers
   */
  insecureHTTPParser?: boolean
  /**
   * Local interface to bind for network connections
   */
  localAddress?: string
  /**
   * Custom lookup function
   */
  lookup?: Function
  /**
   * Maximum length of response headers in bytes
   */
  maxHeaderSize?: number
  /**
   * HTTP request method
   */
  method?: string
  /**
   * Request path
   */
  path?: string
  /**
   * Port of remote server
   */
  port?: number
  /**
   * Protocol to use
   */
  protocol?: string
  /**
   * Specifies whether or not to automatically add the Host header
   */
  setHost?: boolean
  /**
   * Unix Domain Socket
   */
  socketPath?: string
  /**
   * Socket timeout in milliseconds
   */
  timeout?: number
}

/**
 * Node core HTTPS request options
 * | [docs](https://nodejs.org/dist/latest-v14.x/docs/api/https.html#https_https_request_options_callback)
 * | [docs](https://nodejs.org/dist/latest-v14.x/docs/api/tls.html#tls_tls_connect_options_callback)
 * | [docs](https://nodejs.org/dist/latest-v14.x/docs/api/tls.html#tls_tls_createsecurecontext_options)
 */
interface NodeCoreHttpsOptions {
  /**
   * Override the trusted CA certificates
   */
  ca?: string | string[] | Buffer | Buffer[]
  /**
   * Cert chains in PEM format
   */
  cert?: string | string[] | Buffer | Buffer[]
  /**
   * Cipher suite specification
   */
  ciphers?: string
  /**
   * Name of an OpenSSL engine which can provide the client certificate
   */
  clientCertEngine?: string
  /**
   * PEM formatted CRLs (Certificate Revocation Lists)
   */
  crl?: string | string[] | Buffer | Buffer[]
  /**
   * Diffie-Hellman parameters
   */
  dhparam?: string | Buffer
  /**
   * A string describing a named curve or a colon separated list of curve NIDs or names
   */
  ecdhCurve?: string
  /**
   * Attempt to use the server's cipher suite preferences instead of the client's
   */
  honorCipherOrder?: boolean
  /**
   * Private keys in PEM format
   */
  key?: string | string[] | Buffer | Buffer[] | object[]
  /**
   * Shared passphrase used for a single private key and/or a PFX
   */
  passphrase?: string
  /**
   * PFX or PKCS12 encoded private key and certificate chain
   */
  pfx?: string | string[] | Buffer | Buffer[] | object[]
  /**
   * If not false a server automatically reject clients with invalid certificates
   */
  rejectUnauthorized?: boolean
  /**
   * Optionally affect the OpenSSL protocol behavior
   */
  secureOptions?: number
  /**
   * Legacy mechanism to select the TLS protocol version to use
   */
  secureProtocol?: string
  /**
   * Server name for the SNI (Server Name Indication) TLS extension
   */
  servername?: string
  /**
   * Opaque identifier used by servers to ensure session state is not shared between applications
   */
  sessionIdContext?: string
  /**
   * Consistent with the readable stream highWaterMark parameter
   */
  highWaterMark?: number
}

/**
 * Request compose options
 * | [docs](https://github.com/simov/request-compose#options)
 */
interface RequestComposeOptions {
  /**
   * Absolute URL
   */
  url?: string
  /**
   * Proxy URL; for HTTPS use Agent instead
   */
  proxy?: string
  /**
   * URL querystring
   */
  qs?: object | string
  /**
   * application/x-www-form-urlencoded request body
   */
  form?: object | string
  /**
   * JSON encoded request body
   */
  json?: object | string
  /**
   * Raw request body
   */
  body?: string | Buffer | stream.Readable
  /**
   * multipart/form-data as object or multipart/related as array
   * | [docs](https://github.com/simov/request-multipart#request-multipart)
   */
  multipart?: object | []
  /**
   * Basic authentication
   */
  auth?: AuthOptions
  /**
   * OAuth 1.0a authentication
   * | [docs](https://github.com/simov/request-oauth#request-oauth)
   */
  oauth?: OAuthOptions
  /**
   * Response encoding
   */
  encoding?: string
  /**
   * Cookie store
   */
  cookie?: object
  /**
   * Redirect options
   */
  redirect?: RedirectOptions
}

/**
 * Request compose default options
 */
interface RequestComposeDefaults {
  /**
   * Request headers
   * @default {}
   */
  headers?: object
  /**
   * Hostname
   * @default localhost
   */
  hostname?: string
  /**
   * HTTP request method
   * @default 'GET'
   */
  method?: string
  /**
   * Request path
   * @default '/'
   */
  path?: string
  /**
   * Port of remote server
   * @default 80
   */
  port?: number
  /**
   * Protocol to use
   * @default 'http:'
   */
  protocol?: string
  /**
   * Socket timeout in milliseconds
   * @default 3000
   */
  timeout?: number
}

/**
 * Basic authentication
 */
export interface AuthOptions {
  /**
   * User name
   */
  user?: string
  /**
   * Password
   */
  pass?: string
}

/**
 * OAuth 1.0a
 * | [docs](https://github.com/simov/request-oauth#options)
 */
export interface OAuthOptions {
  /**
   * Consumer key
   */
  consumer_key: string
  /**
   * Consumer secret
   */
  consumer_secret?: string
  /**
   * Private key
   */
  private_key?: string
  /**
   * Access token
   */
  token: string
  /**
   * Access secret
   */
  token_secret: string
  /**
   * OAuth version
   * @default 1.0
   */
  version?: string
  /**
   * Signature method
   * @default HMAC-SHA1
   */
  signature_method?: 'HMAC-SHA1' | 'RSA-SHA1' | 'PLAINTEXT'
  /**
   * Transport method
   * @default header
   */
  transport_method?: 'header' | 'query' | 'form'
  /**
   * Timestamp
   */
  timestamp?: string
  /**
   * Nonce
   */
  nonce?: string
  /**
   * Realm
   */
  realm?: string
  /**
   * Body hash string or true to generate one
   */
  body_hash?: string | boolean
}

/**
 * Redirect options
 * | [docs](https://github.com/simov/request-compose#redirect)
 */
export interface RedirectOptions {
  /**
   * Maximum number of redirects to follow
   * @default 3
   */
  max?: number
  /**
   * Follow non-GET HTTP 3xx responses as redirects
   * @default false
   */
  all?: boolean
  /**
   * Follow original HTTP method, otherwise convert all redirects to GET
   * @default true
   */
  method?: boolean
  /**
   * Keep authorization header when changing hostnames
   * @default true
   */
  auth?: boolean
  /**
   * Add referer header
   * @default false
   */
  referer?: boolean
}

/**
 * Node core request options
 */
type NodeCoreRequestOptions = NodeCoreHttpOptions & NodeCoreHttpsOptions

/**
 * Request options
 * | [docs](https://github.com/simov/request-compose#options)
 */
export type RequestOptions = NodeCoreRequestOptions & RequestComposeOptions & RequestComposeDefaults

// ----------------------------------------------------------------------------

/**
 * Request compose default options
 */
type RequestMiddlewareDefaults = NodeCoreRequestOptions & Required<RequestComposeDefaults>

/**
 * Request middleware options
 */
interface RequestMiddlewareOptions {
  /**
   * Node core request options
   */
  options: RequestMiddlewareDefaults
  /**
   * Request body
   */
  body?: string | object | Buffer | stream.Readable
}

/**
 * Response middleware options
 */
interface ResponseMiddlewareOptions {
  /**
   * Node core request options
   */
  options: RequestMiddlewareDefaults
  /**
   * Response object
   */
  res: http.IncomingMessage
  /**
   * Response body
   */
  body?: string | object | Buffer
  /**
   * Raw response body
   */
  raw?: Buffer | string
}

/**
 * Defaults middleware
 */
export type DefaultsMiddleware = (options?: any) => () => RequestMiddlewareOptions

/**
 * Request middleware
 */
export type RequestMiddleware = (options?: any) => (options: RequestMiddlewareOptions) => RequestMiddlewareOptions

/**
 * Response middleware
 */
export type ResponseMiddleware = (options?: any) => (options: ResponseMiddlewareOptions) => ResponseMiddlewareOptions

/**
 * Request middlewares
 */
interface RequestMiddlewares {
  /**
   * Request defaults
   */
  defaults: DefaultsMiddleware
  /**
   * Absolute URL
   */
  url: RequestMiddleware
  /**
   * Proxy URL
   */
  proxy: RequestMiddleware
  /**
   * URL querystring
   */
  qs: RequestMiddleware
  /**
   * Cookie store
   */
  cookie?: RequestMiddleware
  /**
   * application/x-www-form-urlencoded request body
   */
  form: RequestMiddleware
  /**
   * JSON encoded request body
   */
  json: RequestMiddleware
  /**
   * Multipart encoded request body
   */
  multipart?: RequestMiddleware
  /**
   * Raw request body
   */
  body: RequestMiddleware
  /**
   * Basic authentication
   */
  auth: RequestMiddleware
  /**
   * OAuth 1.0a
   */
  oauth?: RequestMiddleware
  /**
   * Request body length
   */
  length: RequestMiddleware
  /**
   * Request
   */
  send: RequestMiddleware
}

/**
 * Response middlewares
 */
interface ResponseMiddlewares {
  /**
   * Buffer response body
   */
  buffer: ResponseMiddleware
  /**
   * Decode gzip/deflate encoded response body
   */
  gzip: ResponseMiddleware
  /**
   * String response body
   */
  string: ResponseMiddleware
  /**
   * Parse JSON or application/x-www-form-urlencoded encoded response body
   */
  parse: ResponseMiddleware
  /**
   * Throw on non successful status codes
   */
  status: ResponseMiddleware
  /**
   * HTTP redirect
   */
  redirect: ResponseMiddleware
}

/**
 * Extend middlewares
 */
interface ExtendMiddlewares {
  /**
   * Request middlewares
   */
  Request?: Partial<RequestMiddlewares>
  /**
   * Response middlewares
   */
  Response?: Partial<ResponseMiddlewares>
}

// ----------------------------------------------------------------------------

/**
 * Client response
 */
export interface ClientResponse {
  /**
   * Response object
   */
  res: http.IncomingMessage
  /**
   * Response body
   */
  body: string | object
}

/**
 * Buffer response
 */
export interface BufferResponse {
  /**
   * Response object
   */
  res: http.IncomingMessage
  /**
   * Response body
   */
  body: Buffer
}

/**
 * Stream response
 */
export interface StreamResponse {
  /**
   * Response object
   */
  res: http.IncomingMessage
}

// ----------------------------------------------------------------------------

/**
 * Functional composition
 */
declare function compose(...functions: any): (options?: any) => Promise<any>

/**
 * Functional composition
 */
declare namespace compose {
  /**
   * Request middlewares
   */
  const Request: RequestMiddlewares
  /**
   * Response middlewares
   */
  const Response: ResponseMiddlewares
  /**
   * Client composition
   */
  function client(options: RequestOptions): Promise<ClientResponse>
  /**
   * Buffer composition
   */
  function buffer(options: RequestOptions): Promise<BufferResponse>
  /**
   * Stream composition
   */
  function stream(options: RequestOptions): Promise<StreamResponse>
  /**
   * Extend instance
   */
  function extend(options: ExtendMiddlewares): typeof compose
}

export default compose
