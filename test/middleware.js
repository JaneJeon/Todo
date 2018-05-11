const expect = require('chai').expect,
	middleware = require('../lib/middleware')
validator = require('validator')

describe('middleware', () => {
	describe('#link()', () => {
		const message = 'Hóla!',
			req = () => ({ flash: () => message })

		context('when input is not empty', () =>
			it('should append error message', () =>
				expect(middleware.link(req(), {})).to.have.property('error', message))
		)

		context('when input is empty', () =>
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
