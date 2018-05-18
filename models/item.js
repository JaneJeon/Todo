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
			children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
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

// https://stackoverflow.com/a/33341301
const autoPopulate = function(next) {
	this.populate('children')
	next()
}

itemSchema.pre('find', autoPopulate)
itemSchema.pre('findOne', autoPopulate)

module.exports = mongoose.model('Item', itemSchema)
