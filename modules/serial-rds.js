'use strict'

import { SerialPort } from 'serialport'
import * as format from './serial-format.js'

export const send = (text, toEprom, path, baudRate, ps, errorCallback) => {
  const serial = new SerialPort({ path, baudRate })

  // @TODO Revisit this. Cascading :(
  serial.on('open', () => {
    serial.write(format.dynamic(text), (err, results) => {
      if (err) {
        errorCallback('send dynamic', '' + err)
      }

      serial.write(format.psBuffered(ps), (err, results) => {
        if (err) {
          errorCallback('send psBuffered', '' + err + ' (sending: ' + ps + ')')
        }

        serial.write(format.ps(ps), (err, results) => {
          if (err) {
            errorCallback('send ps', '' + err + ' (sending: ' + ps + ')')
          }

          if (toEprom) {
            serial.write(format.cmdEprom(), (err, results) => {
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

  serial.on('error', (error) => {
    errorCallback('send other', '' + error)
  })
}

export const reboot = (path, baudRate, errorCallback) => {
  const serial = new SerialPort({ path, baudRate })

  serial.on('open', () => {
    serial.write(format.cmdReboot(), function (err, results) {
      if (err) {
        errorCallback('send cmdReboot', '' + err)
      }

      console.log('Reboot done.')

      serial.close()
    })
  })

  serial.on('error', (error) => {
    errorCallback('reboot other', '' + error)
  })
}