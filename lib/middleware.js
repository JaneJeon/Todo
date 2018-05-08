// express middleware
const _    = require('lodash/object'),
      user = require('./user-validate')

// automatically resolve extensions and link static files
const exts = ['css', 'js']
exports.link = (obj, req) => {
    exts.forEach(ext => {
        if (_.has(obj, ext)) obj[ext] = `/${ext}/${obj[ext]}.${ext}`
    })
    
    // show error message, if there is one
    if (req && (err = req.flash('error'))) obj.error = err
    
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