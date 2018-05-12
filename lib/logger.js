const morgan = require('morgan'),
	debug = require('debug'),
	log = debug('http'),
	dump = debug('error'),
	{ get } = require('lodash')

morgan.token('sessId', req => req.sessionID)
morgan.token('userId', req => get(req, 'user.id'))
morgan.token('access', req => {
	const access = get(req, 'session.access')
	return access ? `access ${access}` : access
})

const format =
	':method :url ":req[content-type]" :req[content-length] ' +
	'res: :status :res[content-length] :response-time[0]ms :access ' +
	'by: :userId :sessId :remote-addr :remote-user :referrer ":user-agent"'

exports.http = morgan(format, {
	stream: { write: msg => log(msg.slice(0, -1)) }
})

exports.error = err => dump(err.stack)
