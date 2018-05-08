// express middleware
const _    = require('lodash'),
      user = require('./user-validate')

// automatically link error
exports.link = (req, obj) => {
    if (error = req.flash('error')) {
        if (_.isNil(obj)) obj = {}
        obj.error = error
    }
    
    return obj
}

// validate & normalize components before they reach the router
exports.normalize = body => {
    if (!body) return true
    
    // validate first, to guard against possibly blocking operations
    if (body.username && user.validateUsername(body.username + '')
     || body.password && user.validatePassword(body.password + '')
     || body.email && user.validateEmail(body.email + ''))
        return false
    
    // normalize components
    if (body.username) {
        body.name = body.username
        body.username = body.username.toLowerCase()
    }
    
    if (body.email) body.email = validator.normalizeEmail(body.email)
    
    return true
}