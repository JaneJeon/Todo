const bcrypt   = require('bcrypt'),
      passport = require('passport'),
      Strategy = require('passport-local').Strategy,
      notFound = {message: 'Invalid username and/or password'}

module.exports = () => {
    passport.use(new Strategy((username, password, done) => {
        // first, see if username even exists, then compare password
        User.find({where: {username: username.toLowerCase()}})
            .then(user => {
                if (!user) return done(null, false, notFound)
                bcrypt
                    .compare(password, user.password)
                    .then(ok => ok ? done(null, user) : done(null, false, notFound))
            })
    }))
    
    passport.serializeUser((user, done) => done(null, user.username))
    
    passport.deserializeUser((username, done) => {
        User.find({where: {username: username}})
            .then(user => done(null, user))
    })
}