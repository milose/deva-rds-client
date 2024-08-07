'use strict'

import clean from './clean.js'
import * as pad from './pad.js'

const max = 8
const maxDps = 80

/*
    Commands
 */
export const cmdRead = () => hexBuffer('fed000c0ff')

export const cmdEprom = () => hexBuffer('fe7145ff')

export const cmdReboot = () => hexBuffer('fe7152ff')

/*
    RDS formatters
 */
export const dynamic = (input) => {
    input = rdsPrepare(input)
    if (input.length > maxDps) input = input.substring(0, maxDps)

    return hexBuffer(
        'fe7600' + hexString(input) + 'fffe76' + hexCount(input) + 'ff'
    )
}

export const ps = (input) => {
    input = clean(input)
    if (input.length > max) input = input.substring(0, max)
    if (input.length < max) input = pad.right(input, max)

    return 'fec8' + hexString(input) + 'ff'
}

export const psBuffered = (input) => {
    input = clean(input)
    if (input.length > max) input = input.substring(0, max)
    if (input.length < max) input = pad.right(input, max)

    return 'fe02' + hexString(input) + 'fffec8' + hexString(input) + 'ff'
}

/*
    Helpers
 */
export const rdsPrepare = (string) => {
    // make an array and remove empty items
    return (
        clean(string)
            .split(' ')
            .filter((word) => word.trim() !== '')
            // check if the previous word can be combined with the current
            .reduce((carry, current) => {
                const previous = carry.slice(-1).pop() // get the previous word

                if (previous && previous.length + current.length < max) {
                    carry.pop() // remove previous item from the array
                    current = previous + ' ' + current // concat it to the current
                }

                carry.push(current)

                return carry
            }, [])
            // make an array of words that are exactly max wide
            .map((word) => {
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
    )
}

/*
    Private methods
 */
const hexString = (string) => {
    let hex = Buffer.from(string, 'ascii').toString('hex')

    // Byte values 0xFD, 0xFE, and 0xFF are transformed into a pair of bytes
    return hex.replace('fd', 'fd00').replace('fe', 'fd01').replace('ff', 'fd02')
}

const hexBuffer = (string) => {
    return new Buffer.from(string, 'hex')
}

const hexCount = (string) => {
    let count = string.length.toString(16)
    if (count.length === 1) {
        count = ''.concat(0, count)
    }

    return count
}
