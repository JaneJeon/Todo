const log = require('debug')('app:error')

module.exports = process.env.NODE_ENV == 'production'
    ? err => log(err.toString())
    : err => log(err.stack)