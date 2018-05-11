const bcrypt = require('bcrypt'),
	validate_user = require('../lib/validate-user'),
	SALT_ROUNDS = 10,
	validate = user => {
		if (
			validate_user.username(user.username) ||
			validate_user.password(user.password) ||
			validate_user.email(user.email)
		)
			throw new Error('The user attempted to circumvent validation checking!')
	},
	normalize = async user => {
		if (user.changed('username')) {
			user.name = user.username
			user.username = user.username.toLowerCase()
		}

		if (user.changed('email')) {
			user.email = validator.normalizeEmail(user.email)
		}

		if (user.changed('password'))
			user.password = await bcrypt.hash(user.password, SALT_ROUNDS)
	}

module.exports = db => {
	const User = db.define(
		'User',
		{
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
				type: Sequelize.STRING
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
		},
		{
			hooks: {
				afterValidate: validate,
				beforeCreate: normalize,
				beforeUpdate: normalize
			}
		}
	)

	User.prototype.checkPassword = async function(password) {
		return await bcrypt.compare(password, this.password)
	}

	return User
}
