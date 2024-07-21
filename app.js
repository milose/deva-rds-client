'use strict'

import 'dotenv/config'
import socketio from 'socket.io-client'
import fetch from 'node-fetch'
import clean from './modules/clean.js'
import * as serial from './modules/serial-rds.js'

const env = process.env
const channel = env.WS_KEY + '.' + env.WS_USER
const baudRate = parseInt(env.RDS_RATE)

const socket = socketio(env.WS_URI, {
    timeout: false,
    query: 'username=' + env.WS_USER,
})

// Main events
socket.on('connect', () => log(`Connected to ${socket.io.uri} ${channel}`))

socket.on(channel, (data) => {
    if (data == null) return

    if (data === 'reboot') {
        notify('RDS reboot initiated.')
        return serial.reboot(env.RDS_PORT, baudRate, serialError)
    }

    log(`Received: ${data} => ${clean(data)}`)

    serial.send(
        data,
        env.RDS_WRITE === 'true',
        env.RDS_PORT,
        baudRate,
        env.RDS_PS,
        serialError
    )
})

socket.on('disconnect', () => {
    const msg = `Disconnected. Writing to RDS: ${env.RDS_DEFAULT}`
    log(msg)
    notify(msg)

    serial.send(
        env.RDS_DEFAULT,
        env.RDS_WRITE === 'true',
        env.RDS_PORT,
        baudRate,
        env.RDS_PS,
        serialError
    )
})

const serialError = (error, data) => {
    const msg = `Serial error: ${error}`
    notify(msg + ' (' + data + ')')
    log(msg, data)
}

const notify = async (content) => {
    if (!env.SLACK_URL) return

    let response = await fetch(env.SLACK_URL, {
        method: 'post',
        body: JSON.stringify({
            content,
            username: env.WS_USER,
            avatar_url: env.SLACK_AVATAR ?? null,
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    if (!response.ok) {
        log(`Slack error: ${response.status}`)
    }
}

const log = (message, data = '') => {
    if (process.env.NODE_ENV !== 'production') console.log(message, data)
}

notify('App started.')
