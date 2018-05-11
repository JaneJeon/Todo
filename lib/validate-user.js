;(function(exports) {
	const minUsername = 5,
		maxUsername = 20,
		minPassword = 8,
		maxPassword = 72

	// all validation functions error message on validation failure, and null on success
	exports.username = function(username) {
		return !validator.isLength(username, {
			min: minUsername,
			max: maxUsername
		})
			? `Username must be between ${minUsername} and ${maxUsername} characters long`
			: !validator.isAlphanumeric(username)
				? 'Username must contain alphanumeric characters only'
				: null
	}

	exports.password = function(password) {
		return validator.isLength(password, {
			min: minPassword,
			max: maxPassword
		})
			? null
			: `Password must be between ${minPassword} and ${maxPassword} characters long`
	}

	exports.email = function(email) {
		return validator.isEmail(email) ? null : 'Invalid email format'
	}
})(typeof exports === 'undefined' ? (this.user_validate = {}) : exports)
