const { expect } = require('chai'),
	middleware = require('../lib/middleware')
validator = require('validator')

describe('middleware', () => {
	describe('#link()', () => {
		const message = 'Hóla!',
			req = supress => ({ flash: () => (supress ? undefined : message) })

		context('when there is no error', () =>
			it('should leave obj alone', () =>
				expect(middleware.link(req(true), null)).to.be.null)
		)

		context('when obj is not empty', () =>
			it('should append error message', () =>
				expect(middleware.link(req(), {})).to.have.property('error', message))
		)

		context('when obj is empty', () =>
			it('should create error message', () => {
				expect(middleware.link(req(), null)).to.have.property('error', message)
				expect(middleware.link(req(), undefined)).to.have.property(
					'error',
					message
				)
			})
		)
	})
})
