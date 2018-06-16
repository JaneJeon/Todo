const morgan = require('morgan'),
	debug = require('debug'),
	{ get } = require('lodash')

// Pipe all standard logs to stdout. Any errors should go to stderr.
debug.log = console.info.bind(console)

morgan.token('sessId', req => req.sessionID)
morgan.token('userId', req => get(req, 'user.id'))
morgan.token('access', req => get(req, 'session.access'))

const format =
	':method :url HTTP/:http-version ":req[content-type]" :req[content-length]B ' +
	'res: :status :res[content-length]B :response-time[0]ms :access ' +
	'by: :userId :sessId :remote-addr :remote-user :referrer ":user-agent"'

exports.http = morgan(format, {
	stream: { write: msg => debug('req:')(msg.slice(0, -1)) }
})

exports.error = err => console.error(err.stack)

exports.server = (msg, code) => {
	debug('server')(msg)
	if (code) process.exit(code)
}
