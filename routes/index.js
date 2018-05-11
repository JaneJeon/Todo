const router = require('express').Router(),
	passport = require('passport'),
	{ get, capitalize } = require('lodash')

router.get(
	'/',
	(req, res) => (req.isAuthenticated() ? res.page('welcome') : res.redirect('/login'))
)

router.get('/register', (req, res) => {
	if (req.isAuthenticated()) return res.redirect('/')
	res.page('register')
})

router.post('/register', async (req, res) => {
	try {
		var user = await User.create(req.body)
	} catch (err) {
		console.error(JSON.stringify(err))
		if (get(err, 'errors[0].type') === 'unique violation') {
			req.flash('error', `${capitalize(err.errors[0].path)} is already taken`)
			return res.redirect('/register')
		}

		return res.json({})
		// TODO: throw error again for logging purposes?
	}

	// automatically log in the user once the account is created
	req.login(user, () => res.redirect('/'))
})

router.get('/login', (req, res) => {
	if (req.isAuthenticated()) return res.redirect('/')
	res.page('login')
})

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/register',
		failureFlash: 'Username and/or password does not match'
	})
)

router.get('/logout', (req, res) => {
	req.logout()
	res.redirect('/')
})

module.exports = router
