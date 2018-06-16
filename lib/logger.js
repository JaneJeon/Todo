const morgan = require('morgan'),
	debug = require('debug'),
	{ get } = require('lodash'),
	format = process.env.NODE_ENV == 'production' ? 'short' : 'dev'

// Pipe all standard logs to stdout. Any errors should go to stderr.
debug.log = console.info.bind(console)

exports.http = morgan(format, {
	stream: { write: msg => debug('http')(msg.slice(0, -1)) }
})

exports.error = err => console.error(err.stack)

exports.server = (msg, code) => {
	debug('server')(msg)
	if (code) process.exit(code)
}
