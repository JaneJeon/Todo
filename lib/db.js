const db = require('knex')({
	client: 'pg',
	connection: process.env.DATABASE_URL,
	debug: process.env.NODE_ENV == 'development'
})

require('objection').Model.knex(db)
module.exports = db
