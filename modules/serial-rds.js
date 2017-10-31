'use strict'

const format = require('./serial-format')
const SerialPort = require('serialport')

exports.reboot = (port, baudRate, errorCallback) => {
  const serial = new SerialPort(port, { baudRate: baudRate })

  serial.on('open', () => {
    serial.write(format.cmdReboot(), function (err, results) {
      if (err) {
        errorCallback('send cmdReboot', '' + err)
      }

      serial.close()
    })
  })

  serial.on('error', error => {
    errorCallback('reboot other', '' + error)
  })
}

exports.send = (text, toEprom, port, baudRate, ps, errorCallback) => {
  const serial = new SerialPort(port, { baudRate: baudRate })

  serial.on('open', () => {
    // Write the text
    serial.write(format.dynamic(text), (err, results) => {
      if (err) {
        errorCallback('send dynamic', '' + err)
      }

      // PS Buffered
      serial.write(format.psBuffered(ps), (err, results) => {
        if (err) {
          errorCallback('send psBuffered', '' + err + ' (sending: ' + ps + ')')
        }

        // PS
        serial.write(format.ps(ps), (err, results) => {
          if (err) {
            errorCallback('send ps', '' + err + ' (sending: ' + ps + ')')
          }

          // Store to eprom
          if (toEprom) {
            serial.write(format.cmdEprom(), (err, results) => {
              if (err) {
                errorCallback('send cmdEprom', '' + err)
              }

              serial.close()
            })
          }

          serial.close()
        })
      })
    })
  })

  serial.on('error', error => {
    errorCallback('send other', '' + error)
  })
}
