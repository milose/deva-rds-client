'use strict'

const path = require('path')

require('dotenv').config({
  path: path.join(__dirname, '.env')
})

let env = process.env

let serial = require('./modules/serial-rds')

serial.reboot(env.RDS_PORT, env.RDS_RATE, function (error) {
  let msg = 'Serial error: ' + error

  if (env.RDS_SILENT === 'false') {
    console.log(msg)
  }
})
