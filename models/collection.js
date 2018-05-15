const mongoose = require('mongoose'),
	check = require('../lib/check'),
	collectionSchema = new mongoose.Schema(
		{
			name: {
				type: String,
				required: true,
				validate: function() {
					return check.name(this.name) == null
				}
			},
			items: [mongoose.Schema.Types.ObjectId]
		},
		{ timestamps: true }
	)

module.exports = mongoose.model('Collection', collectionSchema)
