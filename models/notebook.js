const Sequelize = require('sequelize'),
	Notebook = require('../lib/db').define('Notebook', {
		creator: {
			// TODO: reference
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
			validate: {
				notEmpty: true
			},
			set(name) {
				this.setDataValue('name', name.trim())
			}
		},
		public: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		}
		// TODO: items
		// TODO: collaborators
	})

module.exports = Notebook

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
