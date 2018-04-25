const session    = require('express-session'),
      RedisStore = require('connect-redis')(session)

module.exports = session({
    name: 'sessionId',
    store: new RedisStore({
        client: require('redis').createClient(process.env.REDIS_URL)
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.SECURE == 'true',
        httpOnly: true // for security
    }
})