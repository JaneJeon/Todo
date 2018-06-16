const start = Date.now()
require('dotenv').config() // load before express to set bootup mode
validator = require('validator') // needs to be global for user validation code

const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	chalk = require('chalk'),
	hbs = require('hbs'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Strategy = require('passport-local').Strategy,
	errorMsg = 'Username and/or password does not match',
	User = require('./models/user'),
	path = require('path'),
	session = require('express-session'),
	RedisStore = require('connect-redis')(session),
	log = require('./lib/logger'),
	middleware = require('./lib/middleware')

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', err =>
	log.server(`${chalk.red('✗')} cannot connect to MongoDB: ${err}`, 2)
)

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => done(null, await User.findById(id)))
passport.use(
	new Strategy({ usernameField: 'email' }, async (email, password, done) => {
		// check if user exists
		const user = await User.findByEmail(email)
		if (!user) return done(null, false, { message: errorMsg })

		// match password against the hash
		if (await user.validatePassword(password)) done(null, user)
		else done(null, false, { message: errorMsg })
	})
)

hbs.registerPartials(path.join(__dirname, 'views/partials')) // templating

app.use(require('helmet')())
	.use(require('cors')())
	.use(bodyParser.json()) // AJAX requests
	.use(bodyParser.urlencoded({ extended: false })) // HTTP requests
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
	.use(require('cookie-parser')(process.env.SECRET)) // flash messages
	.use(require('connect-flash')()) // ditto
	.use(passport.initialize())
	.use(passport.session())
	.use(log.http) // HTTP request logger
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

const server = app.listen(process.env.PORT, err => {
	if (err) log.server(`${chalk.red('✗')} cannot start server: ${err}`, 1)

	log.server(`${chalk.green('✓')} running on port ${server.address().port}`)
	log.server(`started in ${Date.now() - start} ms`)
})

module.exports = server
