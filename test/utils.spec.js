const assert = require('assert');
const Utils = require('../lib/utilities');

describe('Autokin Utilities', function () {

    describe('isJSON', function () {
        it('should be able to check if JSON data is valid', function () {
            assert.strictEqual(Utils.isJSON('{"data": 0}'), true);
        });

        it('should be able to check if JSON data is invalid', function () {
            assert.strictEqual(Utils.isJSON('data: 0'), false);
        });
    });

    describe('asJSON', function () {
        it('should be able to convert valid document into JSON object', function () {
            assert.deepStrictEqual(Utils.asJSON('{"data": 0}'), {data:0});
        });

        it('should return "undefiend" if document being converted is invalid', function () {
            assert.strictEqual(Utils.asJSON('data: 0'), undefined);
        });
    });

});