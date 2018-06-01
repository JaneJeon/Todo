const router = require('express').Router(),
	passport = require('passport'),
	User = require('../models/user')

router.get('/', (req, res) => {
	req.isAuthenticated() ? res.page('welcome') : res.redirect('/login')
})

router.get('/register', (req, res) => {
	req.isAuthenticated() ? res.redirect('/') : res.page('register')
})

router.post('/register', async (req, res) => {
	try {
		var user = await User.create(req.body)
	} catch (err) {
		req.session.access = -1
		if (err.name == 'MongoError' && err.code == 11000)
			req.flash('error', 'Email is already taken')

		return res.redirect('/register')
	}

	req.session.access = 1
	req.login(user, () => res.redirect('/'))
})

router.get('/login', (req, res) => {
	req.isAuthenticated() ? res.redirect('/') : res.page('login')
})

router.post('/login', (req, res) =>
	passport.authenticate('local', (err, user) => {
		if (!user) {
			req.session.access = -1
			if (err) req.flash('error', err)

			return res.redirect('/register')
		}

		req.session.access = 1
		req.login(user, () => res.redirect('/'))
	})(req, res)
)

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

module.exports = router
