// express middleware
const { isNil } = require('lodash')

// automatically link error
exports.link = (req, obj) => {
	if ((error = req.flash('error'))) {
		if (isNil(obj)) obj = {}
		obj.error = error
	}

	return obj
}
