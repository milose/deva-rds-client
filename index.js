'use strict'

const path = require('path')

require('dotenv').config({
  path: path.join(__dirname, '.env')
})

let env = process.env

let channel = env.WS_KEY + '.' + env.WS_USER
let toEprom = env.RDS_WRITE === 'true'

let request = require('request')
let serial = require('./modules/serial-rds')
let format = require('./modules/serial-format')

let socket = require('socket.io-client')(env.WS_URI + ':' + env.WS_PORT, {
  timeout: false,
  query: 'username=' + env.WS_USER
})

// Main events
socket.on('connect', function () {
  let msg = 'Connected to ' + socket.io.uri + ' ' + channel

  if (env.RDS_SILENT === 'false') {
    console.log(msg)
  }
})

socket.on('disconnect', function () {
  let msg = 'Disconnected. Writing to RDS: ' + env.RDS_DEFAULT

  if (env.RDS_SILENT === 'false') {
    console.log(msg)
  }

  serial.send(format.rdsPrepare(env.RDS_DEFAULT), toEprom, env.RDS_PORT, env.RDS_RATE, env.RDS_PS, writeError)

  notify(msg)
})

socket.on(channel, function (data) {
  if (data == null) return

  let msg = 'Writing to RDS: ' + data

  if (env.RDS_SILENT === 'false') {
    console.log(msg)
  }

  serial.send(data, toEprom, env.RDS_PORT, env.RDS_RATE, env.RDS_PS, writeError)
})

let writeError = function (error) {
  let msg = 'Serial error: ' + error

  if (env.RDS_SILENT === 'false') {
    console.log(msg)
  }

  notify(msg)
}

function notify (text) {
  if (env.SLACK_URL === '') return

  try {
    request.post(env.SLACK_URL, {
      form: {
        payload: JSON.stringify({
          'username': env.WS_USER,
          'icon_emoji': env.SLACK_ICON,
          'text': text
        })
      }
    })
  } catch (ex) {
    let msg = 'Slack error: ' + ex

    if (env.RDS_SILENT === 'false') {
      console.log(msg)
    }
  }
}
