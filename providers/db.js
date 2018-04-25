const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)
        .catch(err => {
            require('assert').equal(err, null)
        })
        .then(() => {
            console.log('connected to mongo!')
            module.exports = mongoose.connection
        })