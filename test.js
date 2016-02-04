#!/usr/bin/env node

'use strict';

require('dotenv').config({
    path: __dirname + '/.env'
});
var toEprom = process.env.RDS_WRITE == 'true';

var serial = require('./modules/serial-rds');
var format = require('./modules/serial-format');

console.log('nothing to test');
