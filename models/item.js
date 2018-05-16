const mongoose = require('mongoose'),
	itemSchema = new mongoose.Schema(
		{
			parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
			name: {
				type: String,
				trim: true,
				required: true
			},
			body: String,
			completed: Boolean,
			important: Boolean,
			due: Date,
			tags: [
				{ type: String, index: true, trim: true, minlength: 1, lowercase: true }
			]
		},
		{ timestamps: true }
	)

module.exports = mongoose.model('Item', itemSchema)
