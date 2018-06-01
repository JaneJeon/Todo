const morgan = require('morgan'),
	debug = require('debug'),
	log = debug('req:'),
	dump = debug('error' + '\uFEFF'.repeat(5)),
	{ get } = require('lodash')

morgan.token('sessId', req => req.sessionID)
morgan.token('userId', req => get(req, 'user.id'))
morgan.token('access', req => get(req, 'session.access'))

const format =
	':method :url HTTP/:http-version ":req[content-type]" :req[content-length] ' +
	'res: :access :status :res[content-length] :response-time[0]ms ' +
	'by: :userId :sessId :remote-addr :remote-user :referrer ":user-agent"'

exports.http = morgan(format, {
	stream: { write: msg => log(msg.slice(0, -1)) }
})

exports.error = err => dump(err.stack)
