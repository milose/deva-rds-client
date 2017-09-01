'use strict'

const http = require('http')

exports.get = (host, path, callback) => {
  return http.get({ host, path }, response => {
    let body = ''
    response.on('data', d => {
      body += d
    })
    response.on('end', () => callback(body))
  })
}
