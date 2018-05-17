const start = Date.now()
require('dotenv').config() // load before express to set bootup mode

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	chalk = require('chalk'),
	debug = require('debug'),
	hbs = require('hbs'),
	passport = require('passport'),
	path = require('path'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	log = require('./lib/logger'),
	{ link } = require('./lib/middleware')

validator = require('validator') // needs to be global for user validation code

hbs.registerPartials(path.join(__dirname, 'views/partials')) // templating
require('./lib/passport') // user authentication

app /*---------- middlewares ----------*/
	.use(require('helmet')())
	.use(require('cors')())
	.use(bodyParser.json()) // AJAX requests
	.use(bodyParser.urlencoded({ extended: false })) // HTTP requests
	.use(require('cookie-parser')(process.env.SECRET)) // flash messages
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
				secure: Boolean(parseInt(process.env.SECURE)),
				httpOnly: true // for security
			}
		})
	)
	.use(require('connect-flash')())
	.use(passport.initialize())
	.use(passport.session())
	.use(log.http)
	/*---------- views ----------*/
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'hbs')
	/*---------- monkey patching ----------*/
	.use((req, res, next) => {
		delete req.session.access
		res.page = (page, obj) => res.render(page, link(req, obj))
		next()
	})
	/*---------- routes ----------*/
	.use('/', require('./routes/index'))
	/*---------- route error handler ----------*/
	.use('*', (req, res) =>
		// do not pass to application error handler,
		// since that's reserved for uncaught Exceptions only
		res.status(404).page('404')
	)
	/*---------- application error handler ----------*/
	// need all 4 params to be recognized as error handler
	.use((err, req, res, next) => {
		log.error(err)
		res.status(500).page('500')
	})

const server = app.listen(process.env.PORT, async err => {
	if (err) {
		debug('server')(`${chalk.red('✗')} cannot start server: ${err}`)
		process.exit(1)
	}

	try {
		await require('mongoose').connect(process.env.MONGODB_URI)
	} catch (err) {
		debug('server')(`${chalk.red('✗')} cannot connect to MongoDB: ${err}`)
		process.exit(2)
	}

	debug('server')(`${chalk.green('✓')} running on port ${server.address().port}`)
	debug('server')(`started in ${Date.now() - start} ms`)
})

module.exports = server
