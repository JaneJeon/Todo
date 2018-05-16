const mongoose = require('mongoose'),
	collectionSchema = new mongoose.Schema(
		{
			name: {
				type: String,
				trim: true,
				required: true
			},
			items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
		},
		{ timestamps: true }
	)

module.exports = mongoose.model('Collection', collectionSchema)
