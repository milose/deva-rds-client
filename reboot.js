'use strict'

const path = require('path')
const serial = require('./modules/serial-rds')
require('dotenv').config({
    path: path.join(__dirname, '.env'),
})

const env = process.env

serial.reboot(env.RDS_PORT, env.RDS_RATE, (error) => {
    if (!JSON.parse(env.RDS_SILENT)) {
        console.log('Serial error: ' + error)
    }
})
