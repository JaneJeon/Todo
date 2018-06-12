const Sequelize = require('sequelize-hierarchy')(),
	db = new Sequelize(process.env.DATABASE_URL, {
		logging: process.env.NODE_ENV == 'development' ? require('./logger').sql : false,
		operatorsAliases: false,
		dialectOptions: {
			ssl: Boolean(parseInt(process.env.SSL))
		},
		native: true,
		sync: {
			force: process.env.NODE_ENV == 'development'
		}
	})

module.exports = db
