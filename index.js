'use strict'

const path = require('path')
const request = require('request')
const clean = require('./modules/clean')
const socketio = require('socket.io-client')
const serial = require('./modules/serial-rds')

require('dotenv').config({
  path: path.join(__dirname, '.env')
})

const env = process.env
const channel = env.WS_KEY + '.' + env.WS_USER
const baudRate = parseInt(env.RDS_RATE)
const shouldWrite = JSON.parse(env.RDS_WRITE)

const socket = socketio(env.WS_URI + ':' + env.WS_PORT, {
  timeout: false,
  query: 'username=' + env.WS_USER
})

// Main events
socket.on('connect', () => log('Connected to ' + socket.io.uri + ' ' + channel))

socket.on(channel, data => {
  if (data == null) return

  log('Received: ' + data)
  log('RDS Text: ' + clean(data))

  serial.send(data, shouldWrite, env.RDS_PORT, baudRate, env.RDS_PS, serialError)
})

socket.on('disconnect', () => {
  const msg = 'Disconnected. Writing to RDS: ' + env.RDS_DEFAULT
  log(msg)
  notify(msg)

  serial.send(env.RDS_DEFAULT, shouldWrite, env.RDS_PORT, baudRate, env.RDS_PS, serialError)
})

const serialError = (error, data) => {
  const msg = 'Serial error: ' + error
  log(msg, data)
  notify(msg)
}

const notify = text => {
  if (!env.SLACK_URL) return

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
    log('Slack error: ' + ex)
  }
}

const log = (message, data = '') => {
  if (!JSON.parse(env.RDS_SILENT)) {
    console.log(message, data)
  }
}
