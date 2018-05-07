const bcrypt   = require('bcrypt'),
      passport = require('passport'),
      Strategy = require('passport-local').Strategy,
      message  = {message: 'Username and/or password does not match'}

module.exports = () => {
    passport.use(new Strategy(async (username, password, done) => {
        // first, see if username even exists
        const user = await User.find({where: {username: username}})
        if (!user) return done(null, false, message)
        
        // check password against the hash
        return await bcrypt.compare(password, user.password)
            ? done(null, user)
            : done(null, false, message)
    }))
    
    passport.serializeUser((user, done) => done(null, user.username))
    
    passport.deserializeUser(async (username, done) =>
        done(null, await User.find({where: {username: username}}))
    )
}