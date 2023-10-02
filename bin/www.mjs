#!/usr/bin/env node

/**
 * Module dependencies.
 */
import { createServer } from 'http'
import debug from 'debug'
import app from '../app.mjs'

const logger = debug('3550:server')

app.set('port', 8080)



/**
 * Create HTTP server.
 */
const server = createServer(app)


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(`8080 requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`8080 is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address()
    const bind = typeof addr === 'string' ? `pipe ${  addr}` : `port ${  addr.port}`
    logger(`Listening on ${  bind}`)
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(8080)
server.on('error', onError)
server.on('listening', onListening)



