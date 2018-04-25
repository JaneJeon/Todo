const fs = require('fs'),
	path = require('path'),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	session = require('express-session'),
	winston = require('winston'),
	mongoose = require('mongoose'),
	RedisStore = require('connect-redis')(session)

;(async () => {
	await mongoose.connect(process.env.MONGODB_URI)
})()

// handle HTTP logging
morgan.token('sessId', req => {
	return req.sessionID
})
morgan.token('query', req => {
	return Object.keys(req.query).length ? JSON.stringify(req.query) : '-'
})

// exclusively handle application error logging
const logger = new winston.Logger({
	transports: [
		new winston.transports.File({
			filename: path.join(__dirname, 'logs/error.log'),
			timestamp: true,
			handleExceptions: true,
			humanReadableUnhandledException: true,
			json: false
		})
	],
	exitOnError: false
})

app // plug in middlewares
	.use(require('helmet')())
	.use(bodyParser.json()) // AJAX requests
	.use(bodyParser.urlencoded({ extended: true })) // HTTP requests
	.use(
		session({
			name: 'sessionId',
			store: new RedisStore({
				client: require('redis').createClient(process.env.REDIS_URL)
			}),
			secret: process.env.SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: {
				secure: process.env.SECURE == 'true',
				httpOnly: true
			}
		})
	)
	// HTTP logging
	.use(
		morgan(
			'[:date[iso]] [:sessId :remote-addr :remote-user :referrer :user-agent] ' +
			'[:method :url :query :http-version :req[content-type] :req[content-length]] ' +
			'[:status :res[content-length] :response-time ms]', {
				stream: fs.createWriteStream(path.join(__dirname, 'logs/access.log'), {
					flags: 'a'
				})
			}
		)
	)
	// views & templating
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'html')
	.engine('html', require('hbs').__express)
	// routes
	.use('/', require('./routes/index'))
	// 404 handler
	.use('*', (req, res) => {
		// do not pass to application error handler,
		// since that's reserved for uncaught Exceptions only
		res.status(404).send('Page not found\n')
	})
	// application error handler
	.use((err, req, res, next) => {
		// need all 4 params to be recognized as error handler
		logger.log('error', err)
		res.status(500).send('Something broke on our end!\n')
	})

const server = app.listen(process.env.PORT, err => {
	require('assert').equal(err, null)
	console.log('server running on port', server.address().port)
})
