(function(exports) {
    const minUsername = 5, maxUsername = 20,
          minPassword = 8, maxPassword = 72
    
    // all validation functions error message on validation failure, and null on success
    exports.validateUsername = function(username) {
        if (!validator.isLength(username, {min: minUsername, max: maxUsername}))
            return `Username must be between ${minUsername} and ${maxUsername} characters long`
        if (!validator.isAlphanumeric(username))
            return 'Username must contain alphanumeric characters only'
        
        return null
    }
    
    exports.validatePassword = function(password) {
        return validator.isLength(password, {min: minPassword, max: maxPassword})
            ? null
            : `Password must be between ${minPassword} and ${maxPassword} characters long`
    }
    
    exports.validateEmail = function(email) {
        return validator.isEmail(email) ? null : 'Invalid email format'
    }
}(typeof exports === 'undefined' ? this.input = {} : exports))