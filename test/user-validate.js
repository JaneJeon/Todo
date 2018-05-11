const expect = require('chai').expect,
	validate_user = require('../lib/validate-user')
validator = require('validator')

describe('validate_user', () => {
	describe('#username()', () => {
		const valid_username = 'John114'

		context('when username is valid', () =>
			it('should accept it', () =>
				expect(validate_user.username(valid_username)).to.be.null)
		)

		context('when username is too short', () =>
			it('should reject it', () =>
				expect(validate_user.username('cat')).to.not.be.null)
		)

		context('when username is too long', () =>
			it('should reject it', () =>
				expect(validate_user.username('123456789012345678901')).to.not.be.null)
		)

		context("when username isn't alphanumeric", () =>
			it('should reject it', () =>
				expect(validate_user.username('johnny8🤔')).to.not.be.null)
		)
	})

	describe('#password()', () => {
		const valid_password = 'infinity&infinity'

		context('when password is valid', () =>
			it('should accept it', () =>
				expect(validate_user.password(valid_password)).to.be.null)
		)

		context('when password is too short', () =>
			it('should reject it', () =>
				expect(validate_user.password('dog')).to.not.be.null)
		)

		context('when password is too long', () =>
			it('should reject it', () =>
				expect(validate_user.password('a'.repeat(73))).to.not.be.null)
		)
	})

	describe('#email()', () => {
		const valid_email = 'johnny.depp.241@example.com'

		context('when email is valid', () =>
			it('should accept it', () =>
				expect(validate_user.email(valid_email)).to.be.null)
		)

		context('when email is invalid', () =>
			it('should reject it', () => {
				expect(validate_user.email('')).to.not.be.null
				expect(validate_user.email(undefined + '')).to.not.be.null
				expect(validate_user.email('@example.com')).to.not.be.null
				expect(validate_user.email('johnny.depp.214')).to.not.be.null
			})
		)
	})
})
