'use strict'

const path = require('path')
const serial = require('./modules/serial-rds')
require('dotenv').config({
    path: path.join(__dirname, '.env'),
})

const env = process.env
const baudRate = parseInt(env.RDS_RATE)

serial.reboot(env.RDS_PORT, baudRate, (error) => {
    if (!JSON.parse(env.RDS_SILENT)) {
        console.log('Serial error: ' + error)
    }
})
