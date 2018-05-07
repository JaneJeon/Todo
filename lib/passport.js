const bcrypt   = require('bcrypt'),
      passport = require('passport'),
      Strategy = require('passport-local').Strategy,
      notFound = {message: 'Invalid username and/or password'}

module.exports = () => {
    passport.use(new Strategy(async (username, password, done) => {
        // first, see if username even exists
        const user = await User.find({where: {username: username.toLowerCase()}})
        if (!user) return done(null, false, notFound)
        
        // check password against the hash
        await bcrypt.compare(password, user.password)
            ? done(null, user)
            : done(null, false, notFound)
    }))
    
    passport.serializeUser((user, done) => done(null, user.username))
    
    passport.deserializeUser(async (username, done) =>
        done(null, await User.find({where: {username: username}}))
    )
}