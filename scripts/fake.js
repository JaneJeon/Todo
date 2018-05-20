require('dotenv').config()
validator = require('validator')

const faker = require('faker'),
	debug = require('debug'),
	ora = require('ora'),
	Item = require('../models/item'),
	Collection = require('../models/collection'),
	User = require('../models/user'),
	generateItem = () => ({
		name: faker.lorem.sentence(),
		description: faker.lorem.paragraphs()
	})
;(async () => {
	try {
		await require('mongoose').connect(process.env.MONGODB_URI)

		var spinner = ora('generating item user').start()
		const itemUser = await User.create({
			email: faker.internet.email(),
			password: faker.internet.password()
		})

		spinner.text = 'generating item container'
		const itemContainer = await Collection.create({
			creator: itemUser,
			name: 'item-container'
		})

		spinner.text = 'generating top level items'
		let parents = []
		for (let i = 0; i < process.env.SEED; i++) {
			const item = await Item.create(generateItem())
			itemContainer.items.push(item)
			await itemContainer.save()
			parents.push(item)
		}

		let next = []
		for (let i = 1; i <= process.env.DEPTH; i++) {
			spinner.text = `generating depth ${i} items`
			for (let j = 0; j < parents.length; j++)
				for (let k = 0; k < process.env.BRANCH_FACTOR; k++) {
					const item = await Item.create(generateItem())
					parents[j].children.push(item)
					await parents[j].save()
					next.push(item)
				}

			parents = next
			next = []
		}

		spinner.succeed('fake data generated')

		process.exit(0)
	} catch (err) {
		spinner.fail(`fake failed: ${err}`)
		process.exit(1)
	}
})()
