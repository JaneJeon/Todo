const bcrypt      = require('bcrypt'),
      SALT_ROUNDS = 8,

hashPassword = async (user, options) => {
    if (user.changed('password'))
        user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
}

module.exports = db =>
    db.define('User', {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        // the lowercased username
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        // the full-case username; this is what the user sees
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        }
    }, {
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword
        }
    })