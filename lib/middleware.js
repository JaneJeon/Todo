// express middleware
const { isNil } = require('lodash')

// automatically link error
exports.link = (req, obj) => {
	const error = req.flash('error')
	if (error) {
		if (isNil(obj)) obj = {}
		obj.error = error
	}

	return obj
}
