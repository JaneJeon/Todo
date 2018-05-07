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
            set(name) {
                this.setDataValue('username', name.toLowerCase())
                this.setDataValue('name', name)
            }
        },
        // the full-case username; this is what the user sees
        name: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            set(email) {
                this.setDataValue('email', validator.normalizeEmail(email))
            }
        }
    }, {
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword
        }
    })