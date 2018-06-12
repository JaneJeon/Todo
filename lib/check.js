;(function(exports) {
	exports.name = function(name) {
		return name.trim() ? null : 'Cannot be empty'
	}

	exports.email = function(email) {
		return validator.isEmail(email) ? null : 'Invalid email format'
	}

	const [minPassword, maxPassword] = [9, 72]
	exports.minPassword = minPassword
	exports.maxPassword = maxPassword

	exports.password = function(password) {
		return validator.isLength(password, {
			min: minPassword,
			max: maxPassword
		})
			? null
			: `Password must be between ${minPassword} and ${maxPassword} characters long`
	}
})(typeof exports === 'undefined' ? (this.check = {}) : exports)
