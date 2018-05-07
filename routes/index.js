const router   = require('express').Router(),
      passport = require('passport'),
      user     = require('../lib/user-validate')

router.get('/', (req, res) =>
    req.isAuthenticated() ? res.page({body: 'welcome'}) : res.redirect('/login')
)

router.get('/register', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.page({css: 'user-form', js: 'user-validate', body: 'register', bodyClass: 'text-center'})
})

router.post('/register', async (req, res, next) => {
    const body = req.body
    
    // validate first
    if (user.validate(body.username + '', body.password + '', body.email + ''))
        return res.end()
    
    // then check if username is taken
    if (await User.find({where: {username: body.username}}))
        return res.json({message: 'Username is already taken'})
    
    // then create account and automatically log them in
    await User.create(body)
    passport.authenticate('local')(req, res, () => res.redirect('/'))
})

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) return res.redirect('/')
    res.page({css: 'user-form', body: 'login', bodyClass: 'text-center'})
})

router.post('/login', 
    passport.authenticate('local', {failureRedirect: '/login'}), (req, res) => res.redirect('/')
)

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router