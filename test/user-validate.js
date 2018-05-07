const assert    = require('assert'),
      user      = require('../lib/user-validate')
      validator = require('validator')

describe('user', () =>
    describe('#validate()', () => {
        const valid_username = 'John114',
              valid_password = 'infinity&infinity',
              valid_email = 'johnny.depp.241@example.com'
        
        it('should validate username, password, and email', () =>
            assert.equal(user.validate(valid_username, valid_password, valid_email), null)
        )
        
        it('should reject usernames that are too short', () =>
            assert.notEqual(user.validate('cat', valid_password, valid_email), null)
        )
        
        it('should reject usernames that are too long', () =>
            assert.notEqual(user.validate('123456789012345678901', valid_password, valid_email), null)
        )
        
        it('should reject usernames that are not alphanumeric', () =>
            assert.notEqual(user.validate('johnny8🤔', valid_password, valid_email), null)
        )
        
        it('should reject passwords that are too short', () =>
            assert.notEqual(user.validate(valid_username, 'dog', valid_email), null)
        )
        
        it('should reject passwords that are too long', () =>
            assert.notEqual(user.validate(valid_username, 'a'.repeat(73), valid_email), null)
        )
        
        it('should reject invalid emails', () => {
            assert.notEqual(user.validate(valid_username, valid_password, ''), null)
            assert.notEqual(user.validate(valid_username, valid_password, '@example.com'), null)
            assert.notEqual(user.validate(valid_username, valid_password, 'johnny.depp.214'), null)
        })
    })
)