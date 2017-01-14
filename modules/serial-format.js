'use strict'

var max = 8
var maxDps = 80

/*
    RDS formatters
 */
exports.dynamic = function (input) {
  input = this.rdsPrepare(input)
  if (input.length > maxDps) input = input.substring(0, maxDps)

    // @TODO: 20fffe76 vs fffe76
  return hexBuffer('fe7600' + hexString(input) + 'fffe76' + hexCount(input) + 'ff')
}

exports.ps = function (input) {
  input = this.cleanUp(input)
  if (input.length > max) input = input.substring(0, max)
  if (input.length < max) input = input.padRight(max)

  return 'fec8' + hexString(input) + 'ff'
}

exports.psBuffered = function (input) {
  input = this.cleanUp(input)
  if (input.length > max) input = input.substring(0, max)
  if (input.length < max) input = input.padRight(max)

  return 'fe02' + hexString(input) + 'fffec8' + hexString(input) + 'ff'
}

/*
    Commands
 */
exports.cmdRead = function () {
  return hexBuffer('fed000c0ff')
}

exports.cmdEprom = function () {
  return hexBuffer('fe7145ff')
}

exports.cmdReboot = function () {
  return hexBuffer('fe7152ff')
}

/*
    Helpers
 */
exports.rdsPrepare = function (string) {
    // make an array and remove empty items
  return this.cleanUp(string).split(' ').filter((word) => word.trim() !== '')
        // make an array of words that are exactly max wide
        .map((word) => {
          var times = Math.ceil(word.length / max)
          if (times > 1) {
                // word longer then max
            var diff = word.length - max
            var split = []
            for (var i = 0; i <= diff; i++) {
              split.push(word.substring(i, max + i))
            }
                // return as one word
            return split.join('')
          } else {
                // word shorter then max, center it.
            return word.pad(max)
          }
        })
        .join('')
}

exports.cleanUp = function (string) {
  return string.trim()
        // clean unwanted characters
        .latinise()
        .replace('\r', ' ')
        .replace('\n', ' ')
        .replace('!', '')
        .replace('@', '')
        .replace('#', '')
        .replace('%', '')
        .replace('^', '')
        .replace('&', '')
        .replace('*', '')
        .replace('=', '')
        .replace('+', '')
        .replace('?', '')
        .replace(',', '.')
        .replace('$', 'S')
        .replace('"', '\'')
        .replace(';', '').replace(':', '')
        .replace('-', '').replace('_', '')
        .replace('<', '').replace('>', '')
        .replace('{', '').replace('}', '')
        .replace('[', '').replace(']', '')
        .replace('(', '').replace(')', '')
        .replace('/', '').replace('\\', '')
        .replace('  ', ' ')
}

/*
    Private methods
 */
var hexString = function (string) {
  var hex = new Buffer(string, 'ascii').toString('hex')

    // Byte values 0xFD, 0xFE, and 0xFF are transformed into a pair of bytes
  return hex.replace('fd', 'fd00').replace('fe', 'fd01').replace('ff', 'fd02')
}

var hexBuffer = function (string) {
  return new Buffer(string, 'hex')
}

var hexCount = function (string) {
  let count = string.length.toString(16)
  if (count.length === 1) {
    count = ''.concat(0, count)
  }

  return count
}
