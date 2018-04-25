const winston = require('winston')

module.exports = new winston.Logger({
    transports: [
        new winston.transports.Console({
            timestamp: true,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false,
            showLevel: false,
            level: 'error'
        })
    ],
    exitOnError: false
})