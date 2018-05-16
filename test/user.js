const { expect } = require('chai'),
	sinon = require('sinon'),
	bcrypt = require('bcrypt'),
	check = require('../lib/check'),
	User = require('../models/user'),
	default_name = 'User',
	email = 'email',
	password = 'password'

describe('User', () => {
	let emailStub, passwordStub

	before(() => {
		emailStub = sinon.stub(check, 'email')
		passwordStub = sinon.stub(check, 'password')
	})

	beforeEach(() => {
		emailStub.returns(null)
		passwordStub.returns(null)
	})

	after(() => {
		emailStub.restore()
		passwordStub.restore()
	})

	const expectDefaultName = (user, done) => {
		user.validate(err => {
			expect(err).to.be.null
			expect(user.name).to.equal(default_name)
			done()
		})
	}

	it('should set default name if name is missing', done => {
		const user = new User({
			email: email,
			password: password
		})

		expectDefaultName(user, done)
	})

	it('should set default name if name is empty', done => {
		const user = new User({
			name: ' \t  ',
			email: email,
			password: password
		})

		expectDefaultName(user, done)
	})

	it('should be invalid if the email is missing', done => {
		new User({ password: password }).validate(err => {
			expect(err.errors.email).to.exist
			done()
		})
	})

	it('should be invalid if the email is invalid', done => {
		emailStub.returns('error!')

		new User({ email: email, password: password }).validate(err => {
			expect(err.errors.email).to.exist
			done()
		})
	})

	it.skip('should be invalid if there is an existing email', done => {
		// this requires actual database connection to test, so test in app.js
	})

	it('should be invalid if the password is missing', done => {
		new User({ email: email }).validate(err => {
			expect(err.errors.password).to.exist
			done()
		})
	})

	it('should be invalid if the password is invalid', done => {
		passwordStub.returns('error!')

		new User({ email: email, password: password }).validate(err => {
			expect(err.errors.password).to.exist
			done()
		})
	})

	it.skip('should hash the password on save', () => {
		// TODO:
	})

	it.skip('should compare the password against the hash', () => {
		// TODO:
	})

	it.skip('should not select password by default', () => {
		// TODO:
	})

	context.skip('when selecting by email', () => {
		it('should normalize the email before searching', () => {
			// TODO:
		})

		it('should select the password', () => {
			// TODO:
		})
	})
})
