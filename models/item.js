const mongoose = require('mongoose'),
	itemSchema = new mongoose.Schema(
		{
			name: {
				type: String,
				trim: true,
				required: true
			},
			description: String,
			completed: Boolean,
			important: Boolean,
			due: Date,
			path: {
				type: String,
				required: true,
				set: function(basepath) {
					return `${basepath || ''}/${this.id}`
				},
				unique: true
			}
		},
		{ timestamps: true }
	)

itemSchema.index(
	{
		name: 'text',
		description: 'text'
	},
	{
		weights: {
			name: 3,
			description: 2
		}
	}
)

module.exports = mongoose.model('Item', itemSchema)
