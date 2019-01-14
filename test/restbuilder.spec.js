const assert = require('assert');
const { RestBuilder, Response } = require('../lib/autokin-restbuilder');
const nock = require('nock');

let Builder = null;
describe('Rest Builder', function () {

    before(function() {
        Builder = new RestBuilder();
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
    });

    describe('Builder', function () {        
        it('should be able to store value and resolve value', function () {
            Builder.keep('myKey', 'myValue');
            assert.strictEqual(Builder.resolve('myKey'), 'myValue');
        });

        it('should be able to reset the request but not the storage', function () {
            Builder.keep('myKey', 'myValue');
            Builder.reset();
            assert.strictEqual(Builder.resolve('myKey'), 'myValue');
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
            assert.strictEqual(Builder.reqbody.body, '{"data": 0}');
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
});