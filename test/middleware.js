const assert     = require('assert'),
      middleware = require('../lib/middleware')

describe('middleware', () =>
    describe('#link()', () => {
        it('should ignore non-static files', () => {
            const obj = () => ({
                title: 'title',
                body: 'body',
                foo: 'bar'
            })
            
            assert.deepEqual(middleware.link(obj()), obj())
        })
        
        it('should resolve css/js files', () => {
            const obj = {
                title: 'title',
                css: 'account-form',
                js: 'input',
                foo: 'bar'
            },
            expected = {
                title: 'title',
                css: '/css/account-form.css',
                js: '/js/input.js',
                foo: 'bar'
            }
            
            assert.deepEqual(middleware.link(obj), expected)
        })
    })
)