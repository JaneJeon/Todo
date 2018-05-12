const start = Date.now(),
	express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	debug = require('debug'),
	hbs = require('hbs'),
	passport = require('passport'),
	path = require('path'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	log = require('./lib/logger'),
	middleware = require('./lib/middleware')
Sequelize = require('sequelize-hierarchy')()
validator = require('validator')
const dbPromise = require('./lib/db')() // need Sequelize to load

/*---------- logging ----------*/
// set output to stdout, not stderr
debug.log = console.log.bind(console)

// heroku already comes with HTTP logger
if (process.env.NODE_ENV != 'production') app.use(log.http)

/*---------- templating ----------*/
hbs.registerPartials(path.join(__dirname, 'views/partials'))

/*---------- authentication ----------*/
require('./lib/passport')

app /*---------- middlewares ----------*/
	.use(require('helmet')())
	.use(require('cors')())
	.use(bodyParser.json()) // AJAX requests
	.use(bodyParser.urlencoded({ extended: false })) // HTTP requests
	.use(require('cookie-parser')(process.env.SECRET || 'teddy bear')) // literally just for flash messages
	.use(
		session({
			name: 'sessionId',
			store: new RedisStore({
				client: require('redis').createClient(
					process.env.REDIS_URL || 'redis://localhost:6379'
				)
			}),
			secret: process.env.SECRET || 'teddy bear',
			resave: false,
			saveUninitialized: true,
			cookie: {
				secure: Boolean(process.env.SECURE),
				httpOnly: true // for security
			}
		})
	)
	.use(require('connect-flash')())
	.use(passport.initialize())
	.use(passport.session())
	/*---------- views ----------*/
	.use(express.static(path.join(__dirname, 'public')))
	.set('views', path.join(__dirname, 'views'))
	.set('view engine', 'hbs')
	/*---------- monkey patching ----------*/
	.use((req, res, next) => {
		res.page = (page, obj) => res.render(page, middleware.link(req, obj))
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

module.exports = new Promise(resolve => {
	const server = app.listen(process.env.PORT || 3000, async err => {
		try {
			require('assert').equal(err, null)
			await dbPromise
		} catch (err) {
			console.error(`cannot create server: ${err}`)
			console.error('(did you set the environment variables correctly?)')
			process.exit(1)
		} finally {
			resolve(server)
		}

		debug('server')(`running on port ${server.address().port}`)
		debug('server')(`started in ${Date.now() - start} ms`)
	})
})
