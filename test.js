'use strict'

const path = require('path')
const format = require('./modules/serial-format')

require('dotenv').config({
    path: path.join(__dirname, '.env'),
})

// @TODO Use a proper testing tool.
console.log(format.rdsPrepare('mi nismo andjeli').match(/.{1,8}/g))
