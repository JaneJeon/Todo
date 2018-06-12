const Sequelize = require('sequelize'),
	Item = require('../lib/db').define(
		'Item',
		{
			// TODO: text index on name & description via Elasticsearch
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
			description: {
				type: Sequelize.STRING
			},
			completed: {
				type: Sequelize.BOOLEAN
			},
			important: {
				type: Sequelize.BOOLEAN
			},
			due: {
				type: Sequelize.DATE
			}
		},
		{ hierarchy: true }
	)

module.exports = Item
