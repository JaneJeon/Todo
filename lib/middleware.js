// express middleware
const _ = require('lodash/object')

// automatically resolve extensions and link static files
// TODO: how to handle assets?
const exts = ['css', 'js']
exports.link = obj => {
    exts.forEach(ext => {
        if (_.has(obj, ext)) obj[ext] = `/${ext}/${obj[ext]}.${ext}`
    })
    
    return obj // for testing
}