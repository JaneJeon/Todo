// express middleware
const _ = require('lodash/object')

// automatically resolve extensions and link static files
const exts = ['css', 'js']
exports.link = obj => {
    exts.forEach(ext => {
        if (_.has(obj, ext)) obj[ext] = `/${ext}/${obj[ext]}.${ext}`
    })
    
    return obj
}