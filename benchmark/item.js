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
			const tops = await Item.find({ path: /^\/[^\/]+$/ }).exec()
			for (let j = 0; j < tops.length; j++) {
				let items = await Item.find({ path: new RegExp(`^\\${tops[j].path}`) })
				for (let k = 0; k < items.length; k++)
					console.error(JSON.stringify(items[k]))
			}
		}

		// takes around 70 ms to build a full tree for ~1100 items
		console.log(`${iters} iters, avg ${(Date.now() - start) / iters} ms.`)

		process.exit(0)
	})
