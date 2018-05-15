const mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	check = require('../lib/check'),
	SALT_ROUNDS = 10,
	userSchema = new mongoose.Schema(
		{
			name: {
				type: String,
				default: 'User',
				required: true,
				validate: function() {
					return check.name(this.name) == null
				}
			},
			email: {
				type: String,
				unique: true,
				required: true,
				validate: function() {
					return check.email(this.email) == null
				},
				set: email => validator.normalizeEmail(email)
			},
			password: {
				type: String,
				required: true,
				validate: function() {
					return check.password(this.password) == null
				},
				select: false
			},
			collections: [mongoose.Schema.Types.ObjectId]
		},
		{ timestamps: true }
	)

userSchema.pre('save', async function() {
	if (this.isModified('password'))
		this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
})

userSchema.methods.checkPassword = async function(password) {
	return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)
