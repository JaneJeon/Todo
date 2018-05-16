const morgan = require('morgan'),
	debug = require('debug'),
	log = debug('req:'),
	dump = debug('error'),
	{ get } = require('lodash')

morgan.token('sessId', req => req.sessionID)
morgan.token('userId', req => get(req, 'user.id'))
morgan.token('access', req => {
	return (access = get(req, 'session.access') ? `access ${access}` : null)
})

const format =
	':method :url HTTP/:http-version ":req[content-type]" :req[content-length] ' +
	'res: :status :res[content-length] :response-time[0]ms :access ' +
	'by: :userId :sessId :remote-addr :remote-user :referrer ":user-agent"'

exports.http = morgan(format, {
	stream: { write: msg => log(msg.slice(0, -1)) }
})

exports.error = err => dump(err.stack)
