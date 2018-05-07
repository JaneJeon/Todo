const db = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    operatorsAliases: false,
    dialect: 'postgres',
    dialectOptions: {
        ssl: process.env.NODE_ENV == 'production'
    }
})

User       = require('../models/user')(db)
Collection = require('../models/collection')(db)
Item       = require('../models/item')(db)

module.exports = async () => {
    await db.authenticate()
    
    // define relations
    User.belongsToMany(Collection, {through: 'UserCollection'})
    Collection.belongsToMany(User, {through: 'UserCollection'})
    Item.belongsTo(Collection)
    Item.isHierarchy()
    
    await db.sync({force: process.env.NODE_ENV == 'development'})
}