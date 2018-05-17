const { expect } = require('chai'),
	Item = require('../models/item')

describe('Item', () => {
	it('should be invalid if name is missing', done => {
		new Item({}).validate(err => {
			expect(err.errors.name).to.exist
			done()
		})
	})

	it('should be invalid if name is empty', done => {
		new Item({ name: '  \t  \t' }).validate(err => {
			expect(err.errors.name).to.exist
			done()
		})
	})
})
