const morgan = require('morgan'),
      debug  = require('debug'),
      log    = debug('http'),
      dump   = debug('error'),
      _      = require('lodash/object')

morgan.token('sessId', req => req.sessionID)
morgan.token('userId', req => _.get(req, 'user.id'))

const format =
    ':method :url ":req[content-type]" :req[content-length] ' +
    'res: :status :res[content-length] :response-time[0]ms ' +
    'by: :userId :sessId :remote-addr :remote-user :referrer ":user-agent"'

exports.http = morgan(format, {stream: {write: msg => log(msg.slice(0, -1))}})
exports.error = err => dump(err.stack)