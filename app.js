const assert     = require('assert'),
      express    = require('express'),
      app        = express(),
      bodyParser = require('body-parser'),
      db         = require('./providers/db'),
      logger     = require('./providers/error-logger')

app.use(require('helmet')())
   .use(bodyParser.json()) // AJAX requests
   .use(bodyParser.urlencoded({ extended: true })) // HTTP requests
   .use(require('./providers/session'))
   // HTTP logging
   .use(require('./providers/http-logger'))
   // views & templating
   .set('views', require('path').join(__dirname, 'views'))
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
	    logger.log('error', err)
	    res.status(500).render('500.html')
   })

const server = app.listen(process.env.PORT, err => {
	 assert.equal(err, null)
	 console.log('server running on port', server.address().port)
})