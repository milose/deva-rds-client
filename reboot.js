#!/usr/bin/env node

'use strict';

require('dotenv').config({
    path: __dirname + '/.env'
});
var toEprom = process.env.RDS_WRITE == 'true';

var serial = require('./modules/serial-rds');
var format = require('./modules/serial-format');

serial.reboot(process.env.RDS_PORT, process.env.RDS_RATE, function(error) {
    var msg = 'Serial error: ' + error;

    if (process.env.RDS_SILENT == 'false') {
        console.log(msg);
    }
});
