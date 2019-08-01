const assert = require('assert');
const { RestBuilder, Response } = require('../lib/autokin-restbuilder');
const { Store } = require('../lib/autokin');
const Utils = require('../lib/utilities');
const nock = require('nock');
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');

let Builder = null;
describe('Rest Builder', function () {

    before(function() {
        Builder = new RestBuilder();
        if (!fs.existsSync('reports/snapshots')) {
            fs.mkdirSync('reports/snapshots', { recursive: true });
        }
    });

    describe('Body', function () {        
        before(function() {
            Builder.resp = new Response({ body: '{ "data": 0 }' });
        });

        it('should be able to retrieve body instance from Response', function () {
            assert.strictEqual(Builder.Response().Body().isSameAs({data: 0}), true);
        });
        
        it('should be able to retrieve body instance from Response and validate as JSON', function () {
            assert.strictEqual(Builder.Response().Body().isJSON(), true);
        });

        it('should be able to get JSON body from Response', function () {
            let jsonBody = Builder.Response().Body().asJSON();
            assert.notEqual(jsonBody, undefined);
        });

        it('should be able to verify JSON path', function () {
            assert.strictEqual(Builder.Response().Body().hasPath('$.data'), true);
        });

        it('should be able to get value based on JSON path', function () {
            assert.strictEqual(Builder.Response().Body().pathValue('$.data'), 0);
        });
    });

    describe('Response', function () {        
        before(function() {
            Builder.resp = new Response({ 
                headers: {
                    'content-type': 'application/json'
                },
                body: '{ "data": 0 }',
                timingPhases: {
                    total: 400
                },
                statusCode: 200
            });
        });

        it('should be able to check header from response', function () {
            assert.strictEqual(Builder.Response().hasHeader('Content-Type'), true);
        });

        it('should be able to check header value from response', function () {
            assert.strictEqual(Builder.Response().headerValue('Content-Type'), 'application/json');
        });
        
        it('should be able to check HTTP Status Code from response', function () {
            assert.strictEqual(Builder.Response().statusCode(), 200);
        });

        it('should be able to check HTTP response time', function () {
            assert.strictEqual(Builder.Response().responseTime(), 400);
        });
    });

    describe('Builder', function () {        
        it('should be able to store value and resolve value', function () {
            Builder.keep('myKey', 'myValue');
            assert.strictEqual(Store.resolve('myKey'), 'myValue');
        });

        it('should be able to reset the request but not the storage', function () {
            Builder.keep('myKey', 'myValue');
            Builder.reset();
            assert.strictEqual(Store.resolve('myKey'), 'myValue');
            assert.strictEqual(Builder.resp, null);
            assert.deepStrictEqual(Builder.reqbody, {});
        });

        it('should be able to set secure host value', function () {
            Builder.host('domain.com');
            assert.strictEqual(Builder.reqbody.domain, 'domain.com');
            assert.strictEqual(Builder.reqbody.https, true);
        });

        it('should be able to set non-secure host value', function () {
            Builder.host('domain.com', false);
            assert.strictEqual(Builder.reqbody.domain, 'domain.com');
            assert.strictEqual(Builder.reqbody.https, false);
        });

        it('should be able to set request header', function () {
            Builder.header('Content-Type', 'application/json');
            assert.strictEqual(Builder.reqbody.headers['Content-Type'], 'application/json');
        });

        it('should be able to set request query parameter', function () {
            Builder.query('name', 'value');
            assert.strictEqual(Builder.reqbody.qs['name'], 'value');
        });

        it('should be able to set request body', function () {
            Builder.body('{"data": 0}');
            assert.strictEqual(Builder.reqbody.body, '{"data":0}');
        });

        it('should be able to set request basic authentication', function () {
            Builder.basicAuthentication('username', 'password');
            let b64 = Buffer.from('username:password').toString('base64');
            assert.strictEqual(Builder.reqbody.headers['Authorization'], 'Basic ' + b64);
        });

        it('should be able to build a request', function () {
            Builder.reset();
            Builder.host('domain.com');
            Builder.basicAuthentication('username', 'password');
            Builder.query('name', 'value');
            Builder.body('{"name": "test"}');
            Builder.cookie('name=value');

            let requestObject = Builder.build('/sample/uri');

            assert.strictEqual(requestObject.method, 'GET');
            assert.strictEqual(requestObject.uri, 'https://domain.com/sample/uri');
            assert.strictEqual(requestObject.qs['name'], 'value');

            let b64 = Buffer.from('username:password').toString('base64');
            assert.strictEqual(requestObject.headers['Authorization'], 'Basic ' + b64);
        });

        it('should be able to build a request without a body', function () {
            Builder.reset();
            Builder.host('domain.com');
            Builder.basicAuthentication('username', 'password');
            Builder.query('name', 'value');
            Builder.cookie('name=value');

            let requestObject = Builder.build('/sample/uri', 'GET');

            assert.strictEqual(requestObject.method, 'GET');
            assert.strictEqual(requestObject.uri, 'https://domain.com/sample/uri');
            assert.strictEqual(requestObject.qs['name'], 'value');

            let b64 = Buffer.from('username:password').toString('base64');
            assert.strictEqual(requestObject.headers['Authorization'], 'Basic ' + b64);
        });

        it('should be able to build a request for POST', function () {
            Builder.reset();
            Builder.host('domain.com', false);
            Builder.basicAuthentication('username', 'password');
            Builder.query('name', 'value');
            Builder.query('name2', 'value2');
            Builder.cookie('name=value');

            let requestObject = Builder.build('/sample/uri', 'POST');

            assert.strictEqual(requestObject.method, 'POST');
            assert.strictEqual(requestObject.uri, 'http://domain.com/sample/uri');
            assert.strictEqual(requestObject.qs['name'], 'value');

            let b64 = Buffer.from('username:password').toString('base64');
            assert.strictEqual(requestObject.headers['Authorization'], 'Basic ' + b64);
        });
    });

    describe('Builder - Mocked Request', function () {     
        it('should be able to GET a request', function () {
            nock('https://domain.com')
                .get('/sample/uri')
                .reply(200, '{ "data": 0 }');
    
            Builder.reset();
            Builder.host('domain.com');
            Builder.process('/sample/uri', function () {
                assert.strictEqual(Builder.Response().Body().isJSON(), true);
            }, 'GET');
        });

        it('should be able to GET a request without method', function () {
            nock('https://domain.com')
                .get('/sample/uri')
                .reply(200, '{ "data": 0 }');
    
            Builder.reset();
            Builder.host('domain.com');
            Builder.process('/sample/uri', function () {
                assert.strictEqual(Builder.Response().Body().isJSON(), true);
            });
        });

        it('should be able to GET a request with error', function () {
            nock('https://domain.com')
                .get('/sample/uri')
                .reply(400);
    
            Builder.reset();
            Builder.host('domainx.com');
            Builder.process('/sample/uri', function () {
            });
        });
    });

    describe('Body Schema Comaprison', function () {
        it('should be able to validate data with correct expected schema', function () {
            const dataResponse = {
                sessionId: 'aGVsbG8gd29ybGQgYXJpZXM=',
                name: 'Autokin',
                status: 200
            };
            Builder.resp = new Response({ body: JSON.stringify(dataResponse) });
            const result = Utils.expectAsSchema(Builder.Response().Body().asJSON(), './test/schema/basic-schema.json');
            assert.strictEqual(result.length, 0);
        });

        it('should be able to validate data with invalid expected schema', function () {
            const dataResponse = {
                sessionId: 'aGVsbG8gd29ybGQgYXJpZXM=',
                name: 'Autokin',
                status: 0
            };
            Builder.resp = new Response({ body: JSON.stringify(dataResponse) });
            const result = Utils.expectAsSchema(Builder.Response().Body().asJSON(), './test/schema/basic-schema.json');
            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].dataPath, '/status');
        });

        it('should be able to report unknown file schema', function () {
            const dataResponse = {
                sessionId: 'aGVsbG8gd29ybGQgYXJpZXM=',
                name: 'Autokin',
                status: 0
            };
            Builder.resp = new Response({ body: JSON.stringify(dataResponse) });
            try {
                Utils.expectAsSchema(Builder.Response().Body().asJSON(), './ztest/schema/basic-schema.json');
            } catch(error) {
                const invalidPath = path.resolve(process.cwd(), './ztest/schema/basic-schema.json');
                assert.strictEqual(error.message, `Cannot find schema '${invalidPath}'`);
            }
        });
    });
});

describe('Rest Builder with Process Environment', function () {
    it('should be able to report missing variable file', function () {
        process.env.AUTOKIN_VARS = './unknow_file.json';
        Store._merge = Store.merge;
        Store.merge = sinon.spy();
        Builder = new RestBuilder();
        sinon.assert.notCalled(Store.merge);
        Store.merge = Store._merge;
    });

    it('should be able to load and merge variable file', function () {
        process.env.AUTOKIN_VARS = './test/mock/autokin_vars_env.json';
        Store._merge = Store.merge;
        Store.merge = sinon.spy();
        Builder = new RestBuilder();
        sinon.assert.calledOnce(Store.merge);
        Store.merge = Store._merge;
    });
});