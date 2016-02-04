'use strict';

var format = require('./serial-format');
var serialport = require("serialport").SerialPort;

exports.reboot = function(port, baudrate, error_callback) {
    var serial = new serialport(port, {
        baudrate: baudrate
    }, true); // this is the openImmediately flag

    serial.on('open', function() {
        // Write the reboot command
        serial.write(format.cmdReboot(), function(err, results) {
            if (err) {
                error_callback('send dynamic', '' + err);
            }
            serial.close();
        });
    });

    serial.on('error', function(error) {
        error_callback('reboot other', '' + error);
    });

}

exports.send = function(text, toEprom, port, baudrate, ps, error_callback) {
    var serial = new serialport(port, {
        baudrate: baudrate
    }, true); // this is the openImmediately flag

    serial.on('open', function() {
        // Write the text
        serial.write(format.dynamic(text), function(err, results) {
            if (err) {
                error_callback('send dynamic', '' + err);
            }

            // PS Buffered
            serial.write(format.psBuffered(ps), function(err, results) {
                if (err) {
                    error_callback('send psBuffered', '' + err + ' (sending: ' + ps + ')');
                }

                // PS
                serial.write(format.ps(ps), function(err, results) {
                    if (err) {
                        error_callback('send ps', '' + err + ' (sending: ' + ps + ')');
                    }

                    // Store to eprom
                    if (toEprom) {
                        serial.write(format.cmdEprom(), function(err, results) {
                            if (err) {
                                error_callback('send cmdEprom', '' + err);
                            }
                            serial.close();
                        });
                    } else {
                        serial.close();
                    }
                });
            });
        });
    });

    serial.on('error', function(error) {
        error_callback('send other', '' + error);
    });
}
