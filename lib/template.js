// handlebars helper
const _ = require('lodash/string')

// if the body partial is a string, automatically set the title to that
exports.getTitle = (title, body) => isNaN(body) ? _.capitalize(body) : title