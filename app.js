const express    = require('express'),
      app        = express(),
      assert     = require('assert'),
      bodyParser = require('body-parser'),
      debug      = require('debug'),
      error      = debug('error'),
      hbs        = require('hbs'),
      log        = debug('http'),
      mongo      = require('mongoose').connect(process.env.MONGODB_URI),
      morgan     = require('morgan')
      passport   = require('passport'),
      path       = require('path'),
      session    = require('express-session'),
      RedisStore = require('connect-redis')(session),
      User       = require('./models/user'),
      _          = require('lodash')

/*---------- logging ----------*/
morgan.token('sessId', req => {
    return req.sessionID
})

morgan.token('userId', req => {
    return req.user ? req.user._id : '-'
})

const format =
    ':method :url ":req[content-type]" :req[content-length] ' +
    'res: :status :res[content-length] :response-time[0]ms ' +
    'by: :userId :sessId :remote-addr :remote-user :referrer ":user-agent"'

// heroku already comes with HTTP logger
if (process.env.NODE_ENV != 'production')
    app.use(morgan(format, {stream: {write: msg => log(msg.slice(0, -1))}}))

/*---------- templating ----------*/
hbs.registerPartials(path.join(__dirname, 'views/partials'))

// if the body partial is a string, automatically set the title to that
hbs.registerHelper('titler', (title, body) => {
    return isNaN(body) ? _.startCase(body) : title
})

// automatically append the extension path for static files
hbs.registerHelper('static', (file, ext) => {
    if (ext) file += `.${ext}`
    
    return file
        ? `/${ext || 'assets'}/${file}`
        : ''
})

/*---------- authentication ----------*/
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app /*---------- middlewares ----------*/
    .use(require('helmet')())
    .use(require('cors')())
    .use(bodyParser.json()) // AJAX requests
    .use(bodyParser.urlencoded({extended: false})) // HTTP requests
    .use(session({
        name: 'sessionId',
        store: new RedisStore({
            client: require('redis').createClient(process.env.REDIS_URL)
        }),
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: Boolean(process.env.SECURE),
            httpOnly: true // for security
        }
    }))
    .use(passport.initialize())
    .use(passport.session())
    /*---------- views ----------*/
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'hbs')
    /*---------- routes ----------*/
    .use('/', require('./routes/index'))
    /*---------- route error handler ----------*/
    .use('*', (req, res) => {
        // do not pass to application error handler,
        // since that's reserved for uncaught Exceptions only
        res.status(404).render('base', {title: 'Page Not Found', body: '404'})
    })
    /*---------- application error handler ----------*/
    // need all 4 params to be recognized as error handler
    .use((err, req, res, next) => {
        error(err.stack)
        res.status(500).render('base', {title: 'Internal Server Error', body: '500'})
    })

const server = app.listen(process.env.PORT, async err => {
    await mongo
    assert.equal(err, null)
    debug('server')(`running on port ${server.address().port}`)
})