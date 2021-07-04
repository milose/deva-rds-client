'use strict'

var uart = require('serialport')

uart.list()
  .then((list) => list.forEach((port) => console.log(port.path)))
