const assert = require('assert'),
session = require('express-session'),
RedisStore = require('connect-redis')(session)

require('mongodb').MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
	assert.equal(err, null)
	db = client.db('todo')
})

require('express')()
.use(require('body-parser').json())
.use(session({
	store: new RedisStore({
		client: require('redis').createClient(process.env.REDIS_URL)
	}),
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: process.env.SECURE == 'true'
	}
}))
.get('/', (req, res) => {
	console.log(`request from ${req.ip} with id: ${req.sessionID}`)
	res.end()
})
.listen(process.env.PORT, err => {
	assert.equal(err, null)
	console.log('server started!')
})