const dotenv = require('dotenv')
dotenv.config()
dotenv.config({ path: '.test.env' })

const faker = require('faker'),
	debug = require('debug'),
	itemLog = debug('fake:item'),
	collectionLog = debug('fake:collection'),
	Item = require('../models/item'),
	Collection = require('../models/collection'),
	generateItem = () => ({
		name: faker.lorem.sentence(),
		description: faker.lorem.paragraphs()
	})
;(async () => {
	await require('mongoose').connect(process.env.MONGODB_URI)

	collectionLog('generating item container')
	const itemContainer = await Collection.create({ name: 'item-container' })

	let parents = []
	itemLog('generating top-level')
	for (let i = 0; i < process.env.SEED; i++) {
		const item = await Item.create(generateItem())
		itemContainer.items.push(item)
		await itemContainer.save()
		parents.push(item)
	}

	let next = []
	for (let i = 1; i <= process.env.DEPTH; i++) {
		itemLog(`generating depth ${i}`)
		for (let j = 0; j < parents.length; j++)
			for (let k = 0; k < process.env.BRANCH_FACTOR; k++) {
				const item = await Item.create(generateItem())
				parents[j].children.push(item.id)
				await parents[j].save()
				next.push(item)
			}

		parents = next
		next = []
	}

	process.exit(0)
})()
