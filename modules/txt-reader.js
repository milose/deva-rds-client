'use strict'

var http = require('http')

exports.get = function (host, path, callback) {
  return http.get({
    host: host,
    path: path
  }, function (response) {
    var body = ''
    response.on('data', function (d) {
      body += d
    })
    response.on('end', function () {
      callback(body)
    })
  })
}
