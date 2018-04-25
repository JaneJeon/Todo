const path   = require('path'),
      morgan = require('morgan'),
      _      = require('lodash/lang')

morgan.token('sessId', req => {
    return req.sessionID
})
morgan.token('query', req => {
    return _.isEmpty(req.query) ? '-' : JSON.stringify(req.query)
})

const format =
    '[:date[iso]] [:sessId :remote-addr :remote-user :referrer :user-agent] ' +
    '[:method :url :query :http-version :req[content-type] :req[content-length]] ' +
    '[:status :res[content-length] :response-time ms]'

const stream = process.env.NODE_ENV == 'production'
    ? process.stdout // because Heroku is dumb and won't let me log to files
    : require('fs').createWriteStream(
        path.join(path.dirname(__dirname), 'logs/access.log'),
        { flags: 'a' }
    )

module.exports = morgan(format, { stream: stream })