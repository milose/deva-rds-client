'use strict'

import 'dotenv/config'
import fetch from 'node-fetch'
import * as format from './modules/serial-format.js'

const response = await fetch('https://rds.drugacija.me/city/NowOnAir.txt')
const body = await response.text()
// @TODO Use a proper testing tool.
console.log(body)
console.log(format.rdsPrepare(body).match(/.{1,8}/g))
