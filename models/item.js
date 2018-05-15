const mongoose = require('mongoose'),
	check = require('../lib/check'),
	itemSchema = new mongoose.Schema(
		{
			name: {
				type: String,
				required: true,
				validate: function() {
					return check.name(this.name) == null
				}
			},
			body: String,
			completed: Boolean,
			important: Boolean,
			due: Date
		},
		{ timestamps: true }
	)

module.exports = mongoose.model('Item', itemSchema)
