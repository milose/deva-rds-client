'use strict'

const http = require('https')

exports.get = (host, callback) => {
    http.get(host, (res) => {
        const { statusCode } = res

        let error
        // Any 2xx status code signals a successful response but
        // here we're only checking for 200.
        if (statusCode !== 200) {
            error = new Error(
                'Request Failed.\n' + `Status Code: ${statusCode}`
            )
        }

        if (error) {
            console.error(error.message)
            // Consume response data to free up memory
            res.resume()
            return
        }

        res.setEncoding('utf8')
        let body = ''
        res.on('data', (chunk) => {
            body += chunk
        })
        res.on('end', () => callback(body))
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`)
    })
}
