
var t = require('assert')
var querystring = require('querystring')
var qs = require('qs')

var Request = {
  qs: require('../../request/qs'),
}


describe('qs', () => {

  it('undefined', () => {
    t.equal(
      Request.qs()({options: {path: '/'}}).options.path,
      '/',
      'ignore'
    )
  })

  it('undefined + url', () => {
    t.equal(
      Request.qs()({options: {path: '/?c=1:2'}}).options.path,
      '/?c=1:2',
      'ignore'
    )
  })

  it('string', () => {
    t.equal(
      Request.qs('a=!(1)&b=2+3')({options: {path: '/'}}).options.path,
      '/?a=!(1)&b=2+3',
      'do not encode'
    )
  })

  it('string + url', () => {
    t.equal(
      Request.qs('a=!(1)&b=2+3')({options: {path: '/?c=1:2'}}).options.path,
      '/?c=1:2&a=!(1)&b=2+3',
      'prepend and do not encode'
    )
  })

  it('empty object', () => {
    t.equal(
      Request.qs({})({options: {path: '/'}}).options.path,
      '/',
      'ignore'
    )
  })

  it('empty object + url', () => {
    t.equal(
      Request.qs({})({options: {path: '/?b=2:3&c=$5'}}).options.path,
      '/?b=2%3A3&c=%245',
      'ignore'
    )
  })

  it('object', () => {
    t.equal(
      Request.qs({a: '!(1)', b: '2+3'})({options: {path: '/'}}).options.path,
      '/?a=%21%281%29&b=2%2B3',
      'encode reserved characters'
    )
    t.deepEqual(
      querystring.parse(
        Request.qs({a: '!(1)', b: '2+3'})({options: {path: '/'}}).options.path.replace('/?', '')
      ),
      {a: '!(1)', b: '2+3'},
      'encode reserved characters'
    )
  })

  it('object + url', () => {
    t.equal(
      Request.qs({a: '!(1)', b: '2+3'})({options: {path: '/?b=2:3&c=$5'}}).options.path,
      '/?b=2%2B3&c=%245&a=%21%281%29',
      'qs object overrides and extends querystring embedded into the path'
    )
    t.deepEqual(
      querystring.parse(
        Request.qs({a: '!(1)', b: '2+3'})({options: {path: '/?b=2:3&c=$5'}}).options.path.replace('/?', '')
      ),
      {a: '!(1)', b: '2+3', c: '$5'},
      'encode reserved characters'
    )
  })

  it('filter out undefined keys', () => {
    t.equal(
      Request.qs({a: 1, b: undefined, c: 3})({options: {path: '/'}}).options.path,
      '/?a=1&c=3',
      'exclude undefined keys from qs object'
    )
  })

  it('encodeURIComponent + RFC3986', () => {
    var reserved = '!_*_\'_(_)_;_:_@_&_=_+_$_,_/_?_#_[_]'
    t.equal(
      Request.qs({reserved})({options: {path: '/'}}).options.path,
      '/?reserved=%21_%2A_%27_%28_%29_%3B_%3A_%40_%26_%3D_%2B_%24_%2C_%2F_%3F_%23_%5B_%5D',
      'reserved characters should be escaped'
    )
    t.equal(
      Request.qs({reserved})({options: {path: '/'}}).options.path.replace('/?', ''),
      qs.stringify({reserved}),
      'querystring.stringify + RFC3986 should be identical to qs.stringify'
    )
  })

  it('+ character in url querystring', () => {
    t.deepEqual(
      querystring.parse(
        Request.qs({b: 2})({options: {path: '/?a=+'}}).options.path.replace('/?', ''),
      ),
      {a: ' ', b: '2'},
      '+ is decoded as empty space'
    )
    t.deepEqual(
      querystring.parse(
        Request.qs({b: 2})({options: {path: '/?a=+'}}).options.path.replace('/?', ''),
      ),
      qs.parse('a=+&b=2'),
      'querystring.stringify should be identical to qs.stringify'
    )
  })

  it('skip on redirect', () => {
    t.equal(
      Request.qs({a: 1}, {followed: 1})({options: {path: '/?b=2'}}).options.path,
      '/?b=2',
      'do not append original request querystring'
    )
  })

})
