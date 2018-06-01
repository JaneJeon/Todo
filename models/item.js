const mongoose = require('mongoose'),
	itemSchema = new mongoose.Schema({
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
	})

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

itemSchema.moveTo = async function(parent) {
	if (parent) {
		//
	} else {
		// we've moved to a top level
	}
}

module.exports = mongoose.model('Item', itemSchema)
