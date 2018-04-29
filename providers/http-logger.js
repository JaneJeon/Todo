const morgan = require('morgan'),
      log    = require('debug')('app:http')

morgan.token('sessId', req => {
    return req.sessionID
})

const format =
    '[:sessId :remote-addr :remote-user :referrer ":user-agent"]' +
    '[:method :url :http-version ":req[content-type]" :req[content-length]]' +
    '[:status :res[content-length] :response-time[0] ms]'

module.exports = morgan(format, { stream: { write: msg => log(msg.slice(0, -1)) } })