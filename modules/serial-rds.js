'use strict'

var format = require('./serial-format')
var SerialPort = require('serialport').SerialPort

exports.reboot = function (port, baudrate, errorCallback) {
  var serial = new SerialPort(port, {
    baudrate: baudrate
  }, true) // this is the openImmediately flag

  serial.on('open', function () {
        // Write the reboot command
    serial.write(format.cmdReboot(), function (err, results) {
      if (err) {
        errorCallback('send dynamic', '' + err)
      }
      serial.close()
    })
  })

  serial.on('error', function (error) {
    errorCallback('reboot other', '' + error)
  })
}

exports.send = function (text, toEprom, port, baudrate, ps, errorCallback) {
  var serial = new SerialPort(port, {
    baudrate: baudrate
  }, true) // this is the openImmediately flag

  serial.on('open', function () {
        // Write the text
    serial.write(format.dynamic(text), function (err, results) {
      if (err) {
        errorCallback('send dynamic', '' + err)
      }

            // PS Buffered
      serial.write(format.psBuffered(ps), function (err, results) {
        if (err) {
          errorCallback('send psBuffered', '' + err + ' (sending: ' + ps + ')')
        }

                // PS
        serial.write(format.ps(ps), function (err, results) {
          if (err) {
            errorCallback('send ps', '' + err + ' (sending: ' + ps + ')')
          }

                    // Store to eprom
          if (toEprom) {
            serial.write(format.cmdEprom(), function (err, results) {
              if (err) {
                errorCallback('send cmdEprom', '' + err)
              }
              serial.close()
            })
          } else {
            serial.close()
          }
        })
      })
    })
  })

  serial.on('error', function (error) {
    errorCallback('send other', '' + error)
  })
}
