const assert = require('assert');
const { Measure } = require('../lib/autokin');

describe('Autokin Measure', function () {

    it('should be able to create new domain and path entry even it does not exists', function () {
        const data = Measure.get('autokinjs.com', '/session');
        assert.deepEqual(data, {
            count: 0,
            time: []
        });
    });

    it('should be able to get data based on existing domain and path', function () {
        Measure.set('autokinjs.com', '/create', {
            count: 2,
            time: []
        });
        const data = Measure.get('autokinjs.com', '/create');
        assert.deepEqual(data, {
            count: 2,
            time: []
        });
    });

    it('should be able to add new response data', function () {
        Measure.add({
            statusCode: 200,
            request: {
                uri: {
                    host: 'autokinjs.com',
                    pathname: '/users'
                }
            },
            timingPhases: {
                total: 1.0
            }
        });
        const data = Measure.get('autokinjs.com', '/users');
        assert.deepEqual(data, {
            count: 1,
            avg: 1,
            min: 1,
            max: 1,
            errors: 0,
            time: [{
                status: 200,
                timings: {
                    total: 1.0
                }
            }]
        });
    });

    it('should be able to add new response data - second data', function () {
        Measure.add({
            statusCode: 200,
            request: {
                uri: {
                    host: 'autokinjs.com',
                    pathname: '/users'
                }
            },
            timingPhases: {
                total: 1.0
            }
        });
        const data = Measure.get('autokinjs.com', '/users');
        assert.deepEqual(data, {
            count: 2,
            avg: 1,
            min: 1,
            max: 1,
            errors: 0,
            time: [{
                status: 200,
                timings: {
                    total: 1.0
                }
            }, {
                status: 200,
                timings: {
                    total: 1.0
                }
            }]
        });
    });
});