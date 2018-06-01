const mongoose = require('mongoose'),
	User = require('./user'),
	notebookSchema = new mongoose.Schema(
		{
			creator: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true
			},
			name: {
				type: String,
				trim: true,
				required: true
			},
			public: {
				type: Boolean,
				default: false
			},
			collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
			// top-level items, TODO: in order
			items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item', unique: true }]
		},
		{ timestamps: true }
	)

notebookSchema.index({ updatedAt: -1 })

notebookSchema.statics.fetch = async function(collection) {
	return this.findById(collection.id)
		.populate('items', { limit: 10 })
		.exec()
}

module.exports = mongoose.model('Notebook', notebookSchema)
