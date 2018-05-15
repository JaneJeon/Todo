const passport = require('passport'),
	Strategy = require('passport-local').Strategy,
	User = require('../models/user'),
	error = 'Username and/or password does not match'

passport.use(
	new Strategy({ usernameField: 'email' }, async (email, password, done) => {
		// check if user exists
		const user = await User.findOne({ email: validator.normalizeEmail(email) })
			.select('password')
			.exec()
		if (!user) return done(error, null)

		// match password against the hash
		return (await user.checkPassword(password)) ? done(null, user) : done(error, null)
	})
)

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => done(null, await User.findById(id)))
