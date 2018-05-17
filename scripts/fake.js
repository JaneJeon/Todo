require('dotenv').config()

const faker = require('faker'),
	generating = require('debug')('generating'),
	Item = require('../models/item'),
	DEPTH = 3,
	BRANCH_FACTOR = 5,
	SEED = 7,
	generateItem = () => ({
		name: faker.lorem.sentence(),
		description: faker.lorem.paragraphs()
	})

require('mongoose')
	.connect(process.env.MONGODB_URI)
	.then(async () => {
		let parents = []
		generating('top-level items')
		for (let i = 0; i < SEED; i++)
			parents.push(await Item.create(Object.assign(generateItem(), { top: true })))

		let next = []
		for (let i = 0; i < DEPTH; i++) {
			generating(`depth ${i} items`)
			for (let j = 0; j < parents.length; j++)
				for (let k = 0; k < BRANCH_FACTOR; k++) {
					const item = await Item.create(generateItem())
					parents[j].children.push(item.id)
					await parents[j].save()
					next.push(item)
				}

			parents = next
			next = []
		}

		process.exit(0)
	})
