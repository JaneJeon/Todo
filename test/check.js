const { expect } = require('chai'),
	check = require('../lib/check')

validator = require('validator')

describe('check', () => {
	describe('#name()', () => {
		context('when name is not empty', () =>
			it('should accept it', () => expect(check.name('Johnny')).to.be.null)
		)

		context('when name is empty', () =>
			it('should reject it', () => expect(check.name('    \t \t')).to.exist)
		)
	})

	describe('#password()', () => {
		context('when password is valid', () =>
			it('should accept it', () =>
				expect(check.password('raining cats and dogs')).to.be.null)
		)

		context('when password is too short', () =>
			it('should reject it', () => expect(check.password('dog')).to.exist)
		)

		context('when password is too long', () =>
			it('should reject it', () => expect(check.password('a'.repeat(73))).to.exist)
		)
	})

	describe('#email()', () => {
		context('when email is valid', () =>
			it('should accept it', () =>
				expect(check.email('johnny.214@example.com')).to.be.null)
		)

		context('when email is invalid', () =>
			it('should reject it', () => {
				expect(check.email('')).to.exist
				expect(check.email(undefined + '')).to.exist
				expect(check.email('@example.com')).to.exist
				expect(check.email('johnny.214@')).to.exist
			})
		)
	})
})
