#!/usr/bin/env node

'use strict';

require('dotenv').config({
    path: __dirname + '/.env'
});
var channel = process.env.WS_KEY + '.' + process.env.WS_USER;
var toEprom = process.env.RDS_WRITE == 'true';

var request = require('request');
var serial = require('./modules/serial-rds');
var format = require('./modules/serial-format');
var socket = require('socket.io-client')(process.env.WS_URI + ':' + process.env.WS_PORT, {
    timeout: false,
    query: "username=" + process.env.WS_USER,
});

// Main events
socket.on('connect', function() {
    var msg = 'Connected to ' + socket.io.uri + ' ' + channel;

    if (process.env.RDS_SILENT == 'false') {
        console.log(msg);
    }

    notify(msg);
});

socket.on('disconnect', function() {
    var msg = 'Disconnected. Writing to RDS: ' + process.env.RDS_DEFAULT;

    if (process.env.RDS_SILENT == 'false') {
        console.log(msg);
    }

    serial.send(format.rdsPrepare(process.env.RDS_DEFAULT), toEprom, process.env.RDS_PORT, process.env.RDS_RATE, process.env.RDS_PS, write_error);

    notify(msg);
});

socket.on(channel, function(data) {
    var msg = 'Writing to RDS: ' + data;

    if (data == null) return;

    if (process.env.RDS_SILENT == 'false') {
        console.log(msg);
    }

    serial.send(data, toEprom, process.env.RDS_PORT, process.env.RDS_RATE, process.env.RDS_PS, write_error);
});

var write_error = function(error) {
    var msg = 'Serial error: ' + error;

    if (process.env.RDS_SILENT == 'false') {
        console.log(msg);
    }

    notify(msg);
}

function notify(text) {
    if (process.env.SLACK_URL == '') return;

    try {
        request.post(process.env.SLACK_URL, {
            form: {
                payload: JSON.stringify({
                    'username': 'raspberry',
                    'icon_emoji': ':strawberry:',
                    'text': text,
                })
            }
        });
    } catch (ex) {
        var msg = 'Slack error: ' + ex;

        if (process.env.RDS_SILENT == 'false') {
            console.log(msg);
        }
    }
}