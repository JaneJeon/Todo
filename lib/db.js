const db = new Sequelize(
	process.env.DATABASE_URL ||
		`postgres://${require('os').userInfo().username}@localhost:5432/todo`,
	{
		logging: false,
		operatorsAliases: false,
		dialect: 'postgres',
		dialectOptions: {
			ssl: Boolean(parseInt(process.env.SSL))
		}
	}
)

User = require('../models/user')(db)
Collection = require('../models/collection')(db)
Item = require('../models/item')(db)

module.exports = async () => {
	await db.authenticate()

	// define relations
	User.belongsToMany(Collection, { through: 'UserCollection' })
	Collection.belongsToMany(User, { through: 'UserCollection' })
	Item.belongsTo(Collection)
	Item.isHierarchy()

	await db.sync()
}
