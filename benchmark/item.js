// see how long it takes to fully load item trees in a hierarchical manner
// ie. in a way that materialized path is insufficient
require('dotenv').config()

const Item = require('../models/item'),
	Collection = require('../models/collection'),
	VERBOSE = Boolean(parseInt(process.env.VERBOSE))
;(async () => {
	try {
		await require('mongoose').connect(process.env.MONGODB_URI)

		var spinner = require('ora')('benchmarking item.js...').start()
		const start = Date.now()

		for (let i = 0; i < process.env.ITERS; i++) {
			const itemCollection = await Collection.findOne({ name: 'item-container' })
				.populate('items')
				.exec()

			if (VERBOSE)
				itemCollection.items.forEach(item => console.log(JSON.stringify(item)))
		}

		// takes around 50 ms to build a full tree for ~1100 items
		spinner.succeed(
			`benchmark (item): ${process.env.ITERS} runs, avg ${require('pretty-ms')(
				(Date.now() - start) / process.env.ITERS
			)}`
		)

		process.exit(0)
	} catch (err) {
		spinner.fail(`benchmark (item) failed: ${err}`)
		process.exit(1)
	}
})()
