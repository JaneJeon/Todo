const router = require('express').Router(),
	passport = require('passport')

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
		await User.create(req.body)
	} catch (err) {
		return res.json({})
		// TODO: separately catch username/email already taken error
		// TODO: throw error again for logging purposes?
	}

	// automatically log in the user once the account is created
	passport.authenticate('local')(req, res, () => res.redirect('/'))
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
