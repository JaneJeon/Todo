// see how long it takes to fully load item trees in a hierarchical manner
// ie. in a way that materialized path is insufficient
require('dotenv').config()
const Item = require('../models/item')

require('mongoose')
	.connect(process.env.MONGODB_URI)
	.then(async () => {
		const start = Date.now(),
			iters = 1000

		for (let i = 0; i < iters; i++) {
			const items = await Item.find({ top: true }).exec()
			for (let j = 0; j < items.length; j++) console.error(JSON.stringify(items[j]))
		}

		// takes around 80 ms to build a full tree for ~1100 items
		console.log(`${iters} iters, avg ${(Date.now() - start) / iters} ms.`)

		process.exit(0)
	})
