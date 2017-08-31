'use strict'

const path = require('path')

require('dotenv').config({
  path: path.join(__dirname, '.env')
})

var serial = require('./modules/serial-rds')

serial.reboot(process.env.RDS_PORT, process.env.RDS_RATE, function (error) {
  var msg = 'Serial error: ' + error

  if (process.env.RDS_SILENT === 'false') {
    console.log(msg)
  }
})
