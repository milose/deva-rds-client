'use strict'

const path = require('path')

require('dotenv').config({
  path: path.join(__dirname, '.env')
})

var x = require('./modules/txt-reader')

x.get('drugacija.me', '/RDS/NowOnAir.txt', function (data) {
  console.log(data)
})
