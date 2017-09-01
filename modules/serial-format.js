'use strict'
const pad = require('./pad')
const clean = require('./clean')

const max = 8
const maxDps = 80

/*
    Commands
 */
exports.cmdRead = () => hexBuffer('fed000c0ff')

exports.cmdEprom = () => hexBuffer('fe7145ff')

exports.cmdReboot = () => hexBuffer('fe7152ff')

/*
    RDS formatters
 */
exports.dynamic = input => {
  input = this.rdsPrepare(input)
  if (input.length > maxDps) input = input.substring(0, maxDps)

  return hexBuffer('fe7600' + hexString(input) + 'fffe76' + hexCount(input) + 'ff')
}

exports.ps = input => {
  input = clean(input)
  if (input.length > max) input = input.substring(0, max)
  if (input.length < max) input = pad.right(input, max)

  return 'fec8' + hexString(input) + 'ff'
}

exports.psBuffered = input => {
  input = clean(input)
  if (input.length > max) input = input.substring(0, max)
  if (input.length < max) input = pad.right(input, max)

  return 'fe02' + hexString(input) + 'fffec8' + hexString(input) + 'ff'
}

/*
    Helpers
 */
exports.rdsPrepare = string => {
  // make an array and remove empty items
  return clean(string)
    .split(' ')
    .filter(word => word.trim() !== '')
    .map((word) => { // make an array of words that are exactly max wide
      const times = Math.ceil(word.length / max)

      if (times > 1) {
        // word longer then max
        const diff = word.length - max
        let split = []

        for (let i = 0; i <= diff; i++) {
          split.push(word.substring(i, max + i))
        }
        // return as one word
        return split.join('')
      } else {
        // word shorter then max, center it.
        return pad.center(word, max)
      }
    })
    .join('')
}

/*
    Private methods
 */
const hexString = string => {
  let hex = new Buffer(string, 'ascii').toString('hex')

  // Byte values 0xFD, 0xFE, and 0xFF are transformed into a pair of bytes
  return hex.replace('fd', 'fd00').replace('fe', 'fd01').replace('ff', 'fd02')
}

const hexBuffer = string => {
  return new Buffer(string, 'hex')
}

const hexCount = string => {
  let count = string.length.toString(16)
  if (count.length === 1) {
    count = ''.concat(0, count)
  }

  return count
}
