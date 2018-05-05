const router    = require('express').Router(),
      passport  = require('passport'),
      input     = require('../lib/input'),
      User      = require('../models/user')
      validator = require('validator')

router.get('/', (req, res) =>
    req.user ? res.page({body: 'welcome'}) : res.redirect('/login')
)

router.get('/register', (req, res) =>
    res.page({css: 'account-form', js: 'input', body: 'register', bodyClass: 'text-center'})
)

// TODO: take in user email into the User model
// TODO: remember me
// TODO: lowercase username & canonical (cased) version for showing
router.post('/register', (req, res, next) => {
    const username = req.body.username,
          password = req.body.password,
          email = req.body.email
    
    // validate first
    if (input.validate(username + '', password + '', email + ''))
        return res.end()
    
    // then try to register
    User.register(
        new User({username: validator.trim(username)}), 
        password,
        err => {
            if (err) res.json({error: 'Username is already taken'})
            
            // automatically login the user
            passport.authenticate('local')(req, res, () => {
                res.redirect('/')
            })
        }
    )
})

router.get('/login', (req, res) =>
    res.page({css: 'account-form', body: 'login', bodyClass: 'text-center'})
)

router.post('/login', passport.authenticate('local'), (req, res) =>
    res.redirect('/')
)

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router