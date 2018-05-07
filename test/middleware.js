const assert     = require('assert'),
      middleware = require('../lib/middleware')
      validator  = require('validator')

describe('middleware', () => {
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
        
        it('should append error message', () => {
            const message = 'Hóla!'
            
            assert.equal(middleware.link({}, {flash: () => message}).error, message)
        })
    })
    
    describe('#normalize()', () => {
        const valid_username = 'John114',
              valid_password = 'infinity&infinity',
              valid_email    = 'JoHnNy.DePp.241@gmail.com'
        
        it('should ignore empty request body', () => {
            const obj = null
            assert.equal(middleware.normalize(obj), true)
            
            assert.equal(obj, null)
        })
        
        it('should ignore empty fields', () => {
            const obj = {username: null, password: valid_password, email: null}
            assert.equal(middleware.normalize(obj), true)
            
            assert.equal(obj.username, null)
        })
        
        it('should validate parameters', () => {
            assert.equal(middleware.normalize({username: valid_username, email: 1234}), false)
            assert.equal(middleware.normalize({password: valid_password, username: 'nope'}), false)
        })
        
        it('should normalize parameters', () => {
            const obj = {username: valid_username, password: valid_password, email: valid_email}
            assert.equal(middleware.normalize(obj), true)
            
            assert.equal(obj.username, valid_username.toLowerCase())
            assert.equal(obj.email, validator.normalizeEmail(obj.email))
        })
    })
})