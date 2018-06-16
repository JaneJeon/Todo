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
		req.flash('error', 'Email is already taken')

		return res.redirect('/register')
	}

	req.session.access = 1
	req.login(user, () => res.redirect('/'))
})

router.get('/login', (req, res) => {
	req.isAuthenticated() ? res.redirect('/') : res.page('login')
})

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	})
)

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

module.exports = router
