const router   = require('express').Router(),
      passport = require('passport'),
      user     = require('../lib/user-validate')

router.get('/', (req, res) =>
    req.isAuthenticated() ? res.page('welcome') : res.redirect('/login')
)

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.page('register')
})

router.post('/register', async (req, res, next) => {
    try {
        await User.create(req.body)
    } catch (err) {
        req.flash('error', err.toString())
        return res.redirect('/register')
    }
    
    // automatically log in the user if account creation succeeded
    passport.authenticate('local')(req, res, () => res.redirect('/'))
})

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.page('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: 'Username and/or password does not match'
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router