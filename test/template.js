const assert   = require('assert'),
      template = require('../lib/template')

describe('template', () =>
    describe('#getTitle()', () => {
        it('should leave numbers alone', () => 
            assert.equal(template.getTitle('title', '418'), 'title')
        )
        
        it('should capitalize titles', () =>
            assert.equal(template.getTitle(undefined, 'hello!'), 'Hello!')
        )
    })
)