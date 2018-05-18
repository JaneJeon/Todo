const mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	check = require('../lib/check'),
	DEFAULT_NAME = 'User',
	SALT_ROUNDS = 10,
	userSchema = new mongoose.Schema(
		{
			name: {
				type: String,
				default: DEFAULT_NAME,
				// disallow whitespace strings
				set: name => name.trim() || DEFAULT_NAME
			},
			email: {
				type: String,
				unique: true,
				required: true,
				validate: email => check.email(this.email) == null,
				set: email => validator.normalizeEmail(email)
			},
			password: {
				type: String,
				required: true,
				validate: password => check.password(this.password) == null,
				select: false
			},
			// the user's collections or the collections that the user has access to,
			// sorted in anti-chronological order in which the user last viewed it
			collections: [
				{ type: mongoose.Schema.Types.ObjectId, ref: 'Collection', index: true }
			]
		},
		{ timestamps: true, toObject: { setters: true } }
	)

userSchema.pre('save', async function() {
	if (this.isModified('password'))
		this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
})

userSchema.methods.checkPassword = async function(password) {
	return bcrypt.compare(password, this.password)
}

userSchema.statics.findByEmail = async function(email) {
	return this.findOne({ email: validator.normalizeEmail(email) })
		.select('password')
		.exec()
}

module.exports = mongoose.model('User', userSchema)
