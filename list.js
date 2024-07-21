'use strict'

import { SerialPort } from 'serialport'

SerialPort.list().then((list) => list.forEach((port) => console.log(port.path)))
