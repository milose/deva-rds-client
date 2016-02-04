#!/usr/bin/env node

'use strict';

require('dotenv').config();

var x = require('./modules/txt-reader');

x.get('drugacija.me', '/RDS/NowOnAir.txt', function(data) {
    console.log(data);
});
