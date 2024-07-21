'use strict'

export const left = (str, len, chr = ' ') => pad(str, len, 'left', chr)
export const center = (str, len, chr = ' ') => pad(str, len, 'center', chr)
export const right = (str, len, chr = ' ') => pad(str, len, 'right', chr)

const pad = (str, len = 0, dir = 'center', chr = ' ') => {
    if (len + 1 >= str.length) {
        switch (dir) {
            case 'left':
                str = Array(len + 1 - str.length).join(chr) + str
                break

            case 'center':
                const padLen = len - str.length
                const right = Math.ceil(padLen / 2)
                const left = padLen - right
                str =
                    Array(left + 1).join(chr) + str + Array(right + 1).join(chr)
                break

            default:
                str = str + Array(len + 1 - str.length).join(chr)
                break
        }
    }

    return str
}
