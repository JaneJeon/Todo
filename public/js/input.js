(function(exports) {
    // returns error message on validation failure, and null on success
    exports.validate = function(username, password, email) {
        const minUsername = 5, maxUsername = 20,
              minPassword = 8, maxPassword = 30
        
        if (!validator.isLength(username, {min: minUsername, max: maxUsername}))
            return `Username must be between ${minUsername} and ${maxUsername} characters long`
        if (!validator.isAlphanumeric(username))
            return 'Username must contain numbers and alphabets only'
        if (!validator.isLength(password, {min: minPassword, max: maxPassword}))
            return `Password must be between ${minPassword} and ${maxPassword} characters long`
        if (!validator.isEmail(email))
            return 'Invalid email format'
        
        return null
    }
}(typeof exports === 'undefined' ? this.input = {} : exports))