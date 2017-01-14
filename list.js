#!/usr/bin/env node

'use strict'

var uart = require('serialport')

uart.list(function (err, ports) {
  ports.forEach(function (port) {
    if (port.comName) console.log(port.comName)
    if (port.pnpId) console.log(port.pnpId)
    if (port.manufacturer) console.log(port.manufacturer)
  })
})
