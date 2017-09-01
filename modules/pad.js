'use strict'

const STR_PAD_LEFT = 'left';
const STR_PAD_RIGHT = 'right';
const STR_PAD_BOTH = 'center';

exports.pad = (str, len, dir, pad) => {
  if (typeof len == 'undefined') {
    const len = 0;
  }

  if (typeof dir == 'undefined') {
    const dir = STR_PAD_BOTH;
  }

  if (typeof pad == 'undefined') {
    const pad = ' ';
  }

  if (len + 1 >= str.length) {
    switch (dir) {
    case STR_PAD_LEFT:
      str = Array(len + 1 - str.length).join(pad) + str;
      break;
    case STR_PAD_BOTH:
      const right = Math.ceil((padlen = len - str.length) / 2);
      const left = padlen - right;
      str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
      break;
    default:
      str = str + Array(len + 1 - str.length).join(pad);
      break;
    }
  }

  return str;
}
