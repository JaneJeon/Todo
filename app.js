const assert     = require('assert'),
      path       = require('path'),
      express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      logSocket  = require('debug')('app:ws'),
      logError   = require('./providers/error-logger')

app
    .use(require('helmet')())
    .use(require('cors')())
    .use(bodyParser.json()) // AJAX requests
    .use(bodyParser.urlencoded({ extended: false })) // HTTP requests
    .use(require('./providers/session'))
    // HTTP logging
    .use(require('./providers/http-logger'))
    // views & templating
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'html')
    .engine('html', require('hbs').__express)
    // routes
    .use('/', require('./routes/index'))
    // 404 handler
    .use('*', (req, res) => {
        // do not pass to application error handler,
        // since that's reserved for uncaught Exceptions only
        res.status(404).render('404.html')
    })
    // application error handler
    .use((err, req, res, next) => {
        // need all 4 params to be recognized as error handler
        logError(err)
        res.status(500).render('500.html')
    })

const server = app.listen(process.env.PORT, async err => {
    assert.equal(err, null)
    await require('mongoose').connect(process.env.MONGODB_URI)
    console.log('server running on port', server.address().port)
})