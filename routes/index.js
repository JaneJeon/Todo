const router = require('express').Router()

router.get('/', (req, res) => {
	console.log(`request from ${req.ip} with id: ${req.sessionID}`)
	res.end()
})

module.exports = router