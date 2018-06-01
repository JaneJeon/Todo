const mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	check = require('../lib/check'),
	Notebook = require('./notebook'),
	userSchema = new mongoose.Schema({
		name: {
			type: String,
			default: process.env.DEFAULT_NAME,
			// disallow whitespace strings
			set: name => name.trim() || process.env.DEFAULT_NAME
		},
		email: {
			type: String,
			unique: true,
			required: true,
			validate: email => check.email(email) == null,
			set: email => validator.normalizeEmail(email)
		},
		password: {
			type: String,
			required: true,
			validate: password => check.password(password) == null,
			select: false
		}
	})

userSchema.pre('save', async function() {
	if (this.isModified('password'))
		this.password = await bcrypt.hash(this.password, process.env.SALT_ROUNDS)
})

userSchema.methods.checkPassword = async function(password) {
	return bcrypt.compare(password, this.password)
}

// recently touched notebooks
userSchema.methods.getNotebooks = async function() {
	return Notebook.find({ creator: this })
		.sort({ updatedAt: -1 })
		.exec()
}

userSchema.statics.findByEmail = async function(email, includeHash) {
	return this.findOne({ email: validator.normalizeEmail(email) })
		.select({ password: includeHash ? 1 : 0 })
		.exec()
}

module.exports = mongoose.model('User', userSchema)
