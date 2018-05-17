require('dotenv').config()

const faker = require('faker'),
	generating = require('debug')('generating'),
	Item = require('../models/item'),
	DEPTH = 3,
	BRANCH_FACTOR = 5,
	SEED = 7,
	generateItem = parentId => ({
		name: faker.lorem.sentence(),
		description: faker.lorem.paragraphs(),
		path: parentId
	})

require('mongoose')
	.connect(process.env.MONGODB_URI)
	.then(async () => {
		let parents = []
		generating('top-level items')
		for (let i = 0; i < SEED; i++) parents.push(await Item.create(generateItem()))

		let next = []
		for (let i = 1; i <= DEPTH; i++) {
			generating(`depth ${i} items`)
			for (let j = 0; j < parents.length; j++)
				for (let k = 0; k < BRANCH_FACTOR; k++)
					next.push(await Item.create(generateItem(parents[j].path)))

			parents = next
			next = []
		}

		process.exit(0)
	})
