const assert    = require('assert'),
      input     = require('../public/js/input')
      validator = require('validator')

describe('input', () => {
    describe('#validate()', () => {
        const valid_username = 'John114',
              valid_password = 'infinity&infinity',
              valid_email = 'johnny.depp.241@example.com'
        
        it('should validate username, password, and email', () => {
            assert.equal(input.validate(valid_username, valid_password, valid_email), null)
        })
        
        it('should reject usernames that are too short', () => {
            assert.notEqual(input.validate('cat', valid_password, valid_email), null)
        })
        
        it('should reject usernames that are too long', () => {
            assert.notEqual(input.validate('123456789012345678901', valid_password, valid_email), null)
        })
        
        it('should reject usernames that are not alphanumeric', () => {
            assert.notEqual(input.validate('johnny8🤔', valid_password, valid_email), null)
        })
        
        it('should reject passwords that are too short', () => {
            assert.notEqual(input.validate(valid_username, 'dog', valid_email), null)
        })
        
        it('should reject passwords that are too long', () => {
            assert.notEqual(
                input.validate(valid_username, '1234567890123456789012345678901', valid_email), null
            )
        })
        
        it('should reject invalid emails', () => {
            assert.notEqual(input.validate(valid_username, valid_password, ''), null)
            assert.notEqual(input.validate(valid_username, valid_password, '@example.com'), null)
            assert.notEqual(input.validate(valid_username, valid_password, 'johnny.depp.214'), null)
        })
    })
})