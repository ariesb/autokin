const assert = require('assert');
const generators = require('../lib/utilities/generators');
const sinon = require('sinon');

describe('Autokin Generators', function () {
    describe('Loading Names', function () {
        it('should be able to generate male first name based on the original name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.firstName(['male']), 'Abbott');
            randomStub.restore();
        });
    });

    describe('Generate Names', function () {
        let callback = undefined;

        before(function () {
            callback = sinon.stub(generators, 'names');
            callback.returns({
                firstNames: {
                    male: ['Aaa', 'Abb', 'Acc'],
                    female: ['Bbb', 'Baa', 'Bcc'],
                },
                lastNames: ['Lll', 'Laa', 'Lbb'],
            });
        });

        after(function () {
            callback.restore();
        });

        it('should be able to generate male first name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.firstName(['male']), 'Aaa');
            randomStub.restore();
        });

        it('should be able to generate female first name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.firstName(['female']), 'Bbb');
            randomStub.restore();
        });

        it('should be able to generate all first name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.firstName(), 'Aaa');
            randomStub.restore();
        });

        it('should be able to generate last name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.lastName(), 'Lll');
            randomStub.restore();
        });

        it('should be able to generate last name based on name list', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.8);
            assert.strictEqual(generators.lastName(), 'Lbb');
            randomStub.restore();
        });
    });

    describe('Generate Emails', function () {
        it('should be able to generate random email address', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.0001);
            assert.strictEqual(
                generators.email(),
                'aaaaaa.aaaaaa@autokinjs.com'
            );
            randomStub.restore();
        });

        it('should be able to generate random email address with custom domain', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.0001);
            assert.strictEqual(
                generators.email(['autokin.com']),
                'aaaaaa.aaaaaa@autokin.com'
            );
            randomStub.restore();
        });
    });

    describe('Generate Any', function () {
        it('should be able to generate random string with capital letters', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.5);
            assert.strictEqual(
                generators.any([3, 'lowercase', 'uppercase']),
                'AAA'
            );
            randomStub.restore();
        });

        it('should be able to generate random string with numbers', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.723);
            assert.strictEqual(
                generators.any([3, 'lowercase', 'numbers']),
                '111'
            );
            randomStub.restore();
        });

        it('should be able to generate random string with symbols', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.531);
            assert.strictEqual(
                generators.any([3, 'lowercase', 'symbols']),
                '!!!'
            );
            randomStub.restore();
        });

        it('should be able to generate random string with just numbers', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.any([3, 'numbers']), '111');
            randomStub.restore();
        });

        it('should be able to generate random string with small letters only', function () {
            let randomStub = sinon.stub(Math, 'random');
            randomStub.returns(0.00001);
            assert.strictEqual(generators.any([3]), 'aaa');
            randomStub.restore();
        });
    });

    describe('Generate Timestamp', function () {
        it('should be able to generate timestamp of the current date', function () {
            let randomStub = sinon.stub(Date, 'now');
            randomStub.returns(946656000000);
            assert.strictEqual(generators.timestamp(), 946656000000);
            randomStub.restore();
        });

        it('should be able to generate timestamp of the current date with offset of negative 5 minutes', function () {
            let randomStub = sinon.stub(Date, 'now');
            randomStub.returns(946656000000);
            assert.strictEqual(generators.timestamp(['-5']), 946655995000);
            randomStub.restore();
        });

        it('should be able to generate timestamp of the current date with offset of positive 5 minutes', function () {
            let randomStub = sinon.stub(Date, 'now');
            randomStub.returns(946656000000);
            assert.strictEqual(generators.timestamp(['5']), 946656005000);
            randomStub.restore();
        });

        it('should be able to generate timestamp of the current date with offset of positive 5 minutes with 1000 modifier', function () {
            let randomStub = sinon.stub(Date, 'now');
            randomStub.returns(946656000000);
            assert.strictEqual(generators.timestamp(['5', '1000']), 946656005);
            randomStub.restore();
        });
    });
});
