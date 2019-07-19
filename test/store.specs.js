const assert = require('assert');
const { Store } = require('../lib/autokin');

describe('Autokin Store', function () {

    it('should be able to set storage', function () {
        Store.set('key', 'value');
        assert.strictEqual(Store.resolve('key'), 'value');
    });

    it('should be able to merge json object', function () {
        Store.merge({ key1: 'value1' });
        assert.strictEqual(Store.resolve('key'), 'value');
        assert.strictEqual(Store.resolve('key1'), 'value1');
    });

    it('should be able to sanitize string with value from store', function () {
        let pickle = Store.sanitize('Hello {key}');
        assert.strictEqual(pickle, 'Hello value');
    });

    it('should be able to sanitize string with multiple variable value from store', function () {
        let pickle = Store.sanitize('Hello {key} {key1}');
        assert.strictEqual(pickle, 'Hello value value1');
    });

    it('should be able to sanitize string with mixed unknown and known variable value from store', function () {
        let pickle = Store.sanitize('Hello {key} {key2}');
        assert.strictEqual(pickle, 'Hello value {key2}');
    });

    it('should be able to sanitize JSON object', function () {
        let source = {
            name: 'Hello {key}',
            data: {
                inner: 'There {key1}'
            }
        };
        let pickle = Store.sanitizeJson(source);
        assert.strictEqual(pickle.name, 'Hello value');
        assert.strictEqual(pickle.data.inner, 'There value1');
    });
});