const assert = require('assert');
const Utils = require('../lib/utilities');
const fs = require('fs');

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

    describe('detailedSchemaErrors', function () {
        it('should be able to extract error details based on error list', function () {
            const json = JSON.parse(fs.readFileSync('./test/mock/sample-data.json'));
            const schemaErrors = [{
                dataPath: '/key',
                message: 'Invalid error message',
                schemaPath: '/key/type'
            }];
            const detailedSchemaErrors = JSON.parse(Utils.detailedSchemaErrors(json, schemaErrors, '1-abcd-efgh'));
            assert.strictEqual(detailedSchemaErrors[0].lineNumber, 2);
        });

        it('should be able to extract error details based on error list in deep objects', function () {
            const json = JSON.parse(fs.readFileSync('./test/mock/sample-data.json'));
            const schemaErrors = [{
                dataPath: '/sub/id',
                message: 'Invalid error message',
                schemaPath: '/sub/id/type'
            }];
            const detailedSchemaErrors = JSON.parse(Utils.detailedSchemaErrors(json, schemaErrors, '1-abcd-efgh'));
            assert.strictEqual(detailedSchemaErrors[0].lineNumber, 5);
            assert.strictEqual(detailedSchemaErrors[0].dataPath, schemaErrors[0].dataPath);
            assert.strictEqual(detailedSchemaErrors[0].schemaPath, schemaErrors[0].schemaPath);
            assert.strictEqual(detailedSchemaErrors[0].message, schemaErrors[0].message);
            assert.strictEqual(detailedSchemaErrors[0].source, '1-abcd-efgh');
        });

        it('should be able to extract error details based on error list in deep objects bypassing early object block', function () {
            const json = JSON.parse(fs.readFileSync('./test/mock/sample-data.json'));
            const schemaErrors = [{
                dataPath: '/basic/key',
                message: 'Invalid error message',
                schemaPath: '/basic/key/type'
            }];
            const detailedSchemaErrors = JSON.parse(Utils.detailedSchemaErrors(json, schemaErrors, '1-abcd-efgh'));
            assert.strictEqual(detailedSchemaErrors[0].lineNumber, 8);
        });

        it('should be able to extract error details based on error list in deep array objects', function () {
            const json = JSON.parse(fs.readFileSync('./test/mock/sample-data.json'));
            const schemaErrors = [{
                dataPath: '/items/1/qty',
                message: 'Invalid error message',
                schemaPath: '/items/qty/type'
            }];
            const detailedSchemaErrors = JSON.parse(Utils.detailedSchemaErrors(json, schemaErrors, '1-abcd-efgh'));
            assert.strictEqual(detailedSchemaErrors[0].lineNumber, 17);
        });

        it('should be able to extract error details for missing properties', function () {
            const json = JSON.parse(fs.readFileSync('./test/mock/sample-data.json'));
            const schemaErrors = [{
                dataPath: '/advance',
                message: 'Invalid error message',
                schemaPath: '/advance/type'
            }];
            const detailedSchemaErrors = JSON.parse(Utils.detailedSchemaErrors(json, schemaErrors, '1-abcd-efgh'));
            assert.strictEqual(detailedSchemaErrors[0].lineNumber, undefined);
        });

    });

});