const express    = require('express'),
      app        = express(),
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
      middleware = require('./lib/middleware'),
      template   = require('./lib/template'),
      User       = require('./models/user'),
      _          = require('lodash/object')

/*---------- logging ----------*/
morgan.token('sessId', req => req.sessionID)
morgan.token('userId', req => _.get(req, 'user._id'))

const format =
    ':method :url ":req[content-type]" :req[content-length] ' +
    'res: :status :res[content-length] :response-time[0]ms ' +
    'by: :userId :sessId :remote-addr :remote-user :referrer ":user-agent"'

// heroku already comes with HTTP logger
if (process.env.NODE_ENV != 'production')
    app.use(morgan(format, {stream: {write: msg => log(msg.slice(0, -1))}}))

/*---------- templating ----------*/
hbs.registerHelper('auto', template.getTitle)
hbs.registerPartials(path.join(__dirname, 'views/partials'))

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
    /*---------- monkey patching ----------*/
    .use((req, res, next) => {
        res.page = obj => res.render('template', middleware.link(obj))
        next()
    })
    /*---------- routes ----------*/
    .use('/', require('./routes/index'))
    /*---------- route error handler ----------*/
    .use('*', (req, res) =>
        // do not pass to application error handler,
        // since that's reserved for uncaught Exceptions only
        res.status(404).page({title: 'Page Not Found', body: '404'})
    )
    /*---------- application error handler ----------*/
    // need all 4 params to be recognized as error handler
    .use((err, req, res, next) => {
        error(err.stack)
        res.status(500).page({title: 'Internal Server Error', body: '500'})
    })

const server = app.listen(process.env.PORT, async err => {
    await mongo
    require('assert').equal(err, null)
    debug('server')(`running on port ${server.address().port}`)
})