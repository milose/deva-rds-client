'use strict'

const path = require('path')

require('dotenv').config({
    path: path.join(__dirname, '.env'),
})

var x = require('./modules/txt-reader')

//rds.drugacija.me/city/NowOnAir.txt
x.get('https://rds.drugacija.me/city/NowOnAir.txt', (data) => console.log(data))
