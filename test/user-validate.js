const assert    = require('assert'),
      user      = require('../lib/user-validate')
      validator = require('validator')

describe('user', () => {
    describe('#validateUsername()', () => {
        const valid_username = 'John114'
        
        it('should validate username', () =>
            assert.equal(user.validateUsername(valid_username), null)
        )
        
        it('should reject usernames that are too short', () =>
            assert.notEqual(user.validateUsername('cat'), null)
        )
        
        it('should reject usernames that are too long', () =>
            assert.notEqual(user.validateUsername('123456789012345678901'), null)
        )
        
        it('should reject usernames that are not alphanumeric', () =>
            assert.notEqual(user.validateUsername('johnny8🤔'), null)
        )
    })
    
    describe('#validatePassword()', () => {
        const valid_password = 'infinity&infinity'
        
        it('should validate password', () =>
            assert.equal(user.validatePassword(valid_password), null)
        )
        
        it('should reject passwords that are too short', () =>
            assert.notEqual(user.validatePassword('dog'), null)
        )
        
        it('should reject passwords that are too long', () =>
            assert.notEqual(user.validatePassword('a'.repeat(73)), null)
        )
    })
    
    describe('#validateEmail()', () => {
        const valid_email = 'johnny.depp.241@example.com'
        
        it('should validate email', () =>
            assert.equal(user.validateEmail(valid_email), null)
        )
        
        it('should reject invalid emails', () => {
            assert.notEqual(user.validateEmail(''), null)
            assert.notEqual(user.validateEmail(undefined + ''), null)
            assert.notEqual(user.validateEmail('@example.com'), null)
            assert.notEqual(user.validateEmail('johnny.depp.214'), null)
        })
    })
})