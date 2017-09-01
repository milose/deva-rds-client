'use strict'

exports.left = (str, len, chr = ' ') => pad(str, len, 'left', chr)
exports.center = (str, len, chr = ' ') => pad(str, len, 'center', chr)
exports.right = (str, len, chr = ' ') => pad(str, len, 'right', chr)

const pad = (str, len, dir, chr) => {
  if (typeof len == 'undefined') {
    const len = 0;
  }

  if (typeof dir == 'undefined') {
    const dir = 'center';
  }

  if (typeof chr == 'undefined') {
    const chr = ' ';
  }

  if (len + 1 >= str.length) {
    switch (dir) {
    case 'left':
      str = Array(len + 1 - str.length).join(chr) + str;
      break;
    case 'center':
      const padLen = len - str.length
      const right = Math.ceil(padLen / 2);
      const left = padLen - right;
      str = Array(left + 1).join(chr) + str + Array(right + 1).join(chr);
      break;
    default:
      str = str + Array(len + 1 - str.length).join(chr);
      break;
    }
  }

  return str;
}
