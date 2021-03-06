'use strict'

const diacritics = require('diacritics')

module.exports = input => {
  input = diacritics.remove(input)

  return input.trim()
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
