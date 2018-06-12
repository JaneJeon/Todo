const Sequelize = require('sequelize'),
	{ compare, hash } = require('bcrypt'),
	{ minPassword, maxPassword } = require('../lib/check'),
	hashPassword = async user => {
		if (user.changed('password'))
			user.password = await hash(user.password, process.env.SALT_ROUNDS)
	},
	User = require('../lib/db').define(
		'User',
		{
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: process.env.DEFAULT_NAME,
				validate: {
					notEmpty: true
				},
				set(name) {
					this.setDataValue('name', name.trim())
				}
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false,
				validate: {
					isEmail: true
				},
				set(email) {
					this.setDataValue('email', validator.normalizeEmail(email))
				}
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				validate: {
					len: [minPassword, maxPassword]
				}
			}
		},
		{
			hooks: {
				beforeCreate: hashPassword,
				beforeUpdate: hashPassword
			}
		}
	)

User.prototype.validatePassword = async function(password) {
	return compare(password, this.password)
}

module.exports = User
