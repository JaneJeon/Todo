const mongoose = require('mongoose'),
	notebookSchema = new mongoose.Schema(
		{
			creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			name: {
				type: String,
				trim: true,
				required: true
			},
			public: { type: Boolean, default: false },
			collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
			// top-level items
			items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
		},
		{ timestamps: true }
	)

module.exports = mongoose.model('Notebook', notebookSchema)
