'use strict'

import 'dotenv/config'
import * as serial from './modules/serial-rds.js'

const env = process.env

serial.reboot(env.RDS_PORT, parseInt(env.RDS_RATE), (error) => {
    console.log('Serial error: ' + error)
})
