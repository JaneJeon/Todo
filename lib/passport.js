const passport = require('passport'),
	Strategy = require('passport-local').Strategy,
	error = 'Username and/or password does not match'

passport.use(
	new Strategy(async (username, password, done) => {
		// first, see if username even exists
		const user = await User.find({ where: { username: username.toLowerCase() } })
		if (!user) return done(error, null)

		// check password against the hash
		return (await user.checkPassword(password)) ? done(null, user) : done(error, null)
	})
)

passport.serializeUser((user, done) => done(null, user.username))

passport.deserializeUser(async (username, done) =>
	done(null, await User.find({ where: { username: username } }))
)
